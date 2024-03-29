import { PromisePool, OnProgressCallback } from "@supercharge/promise-pool"
import {
  ArtistArtworksOfflineQuery,
  ArtistArtworksOfflineQuery$data,
} from "__generated__/ArtistArtworksOfflineQuery.graphql"
import {
  ArtistDocumentsQuery,
  ArtistDocumentsQuery$data,
} from "__generated__/ArtistDocumentsQuery.graphql"
import {
  ArtistShowsQuery,
  ArtistShowsQuery$rawResponse,
} from "__generated__/ArtistShowsQuery.graphql"
import {
  ArtistsListQuery,
  ArtistsListQuery$data,
} from "__generated__/ArtistsListQuery.graphql"
import {
  ArtworkQuery,
  ArtworkQuery$data,
} from "__generated__/ArtworkQuery.graphql"
import {
  ShowArtworksOfflineQuery,
  ShowArtworksOfflineQuery$data,
} from "__generated__/ShowArtworksOfflineQuery.graphql"
import {
  ShowDocumentsQuery,
  ShowDocumentsQuery$data,
} from "__generated__/ShowDocumentsQuery.graphql"
import {
  ShowInstallsQuery,
  ShowInstallsQuery$data,
} from "__generated__/ShowInstallsQuery.graphql"
import {
  ShowTabsQuery,
  ShowTabsQuery$data,
} from "__generated__/ShowTabsQuery.graphql"
import {
  ShowsTabQuery,
  ShowsTabQuery$data,
} from "__generated__/ShowsTabQuery.graphql"
import { artistArtworksOfflineQuery } from "apps/Artists/routes/ArtistTabs/ArtistArtworks"
import { artistDocumentsQuery } from "apps/Artists/routes/ArtistTabs/ArtistDocuments"
import { artistShowsQuery } from "apps/Artists/routes/ArtistTabs/ArtistShows"
import { artworkQuery } from "apps/Artwork/routes/Artwork/Artwork"
import { showsTabQuery } from "apps/Shows/ShowsTab"
import { showArtworksOfflineQuery } from "apps/Shows/routes/ShowTabs/ShowArtworks"
import { showDocumentsQuery } from "apps/Shows/routes/ShowTabs/ShowDocuments"
import { showInstallsQuery } from "apps/Shows/routes/ShowTabs/ShowInstalls"
import { showTabsQuery } from "apps/Shows/routes/ShowTabs/ShowTabs"
import { artistsListQuery } from "components/Lists/ArtistsList"
import { compact, once } from "lodash"
import { Alert } from "react-native"
import { Disposable } from "react-relay"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { RelayContextProps } from "system/relay/RelayProvider"
import { GlobalStore } from "system/store/GlobalStore"
import {
  initDownloadFileToCache,
  getFileFromCache,
  saveFileToCache,
  DownloadFileToCacheProps,
  getURLMap,
  clearSyncProgressFileCache,
  JSON_FILES,
} from "system/sync/fileCache"
import { getCurrentSyncProgress } from "system/sync/fileCache/getCurrentSyncProgress"
import { retryOperation } from "system/sync/retryOperation"
import { FetchError, initFetchOrCatch } from "system/sync/utils/fetchOrCatch"
import { delay } from "utils/delay"
import { extractNodes } from "utils/extractNodes"

export interface SyncResultsData {
  artistsListQuery?: ArtistsListQuery$data
  showsTabQuery?: ShowsTabQuery$data
  artistArtworksQuery?: ArtistArtworksOfflineQuery$data[]
  artworkQuery?: ArtworkQuery$data[]
  artistShowsQuery?: ArtistShowsQuery$rawResponse[]
  showTabsQuery?: ShowTabsQuery$data[]
  artistDocumentsQuery?: ArtistDocumentsQuery$data[]
  partnerShowTabsQuery?: ShowTabsQuery$data[]
  showArtworksQuery?: ShowArtworksOfflineQuery$data[]
  showInstallsQuery?: ShowInstallsQuery$data[]
  showDocumentsQuery?: ShowDocumentsQuery$data[]
  queryErrors: FetchError[]
  fileDownloadErrors: DownloadFileToCacheProps[]
  disposableQueries: Disposable[]
}

/**
 * Intial sync results data
 */
const syncResults: SyncResultsData = {
  artistsListQuery: undefined,
  showsTabQuery: undefined,
  artistArtworksQuery: [],
  artworkQuery: [],
  artistShowsQuery: [],
  showTabsQuery: [],
  artistDocumentsQuery: [],
  partnerShowTabsQuery: [],
  showArtworksQuery: [],
  showInstallsQuery: [],
  showDocumentsQuery: [],

  // Error retries
  queryErrors: [],
  fileDownloadErrors: [],

  /**
   * When individual query syncs complete from above, store their corresponding
   * relay disposable refs so that we can properly evict them from memory after
   * writing to the offline JSON file on disk.
   *
   * This is necessary because if we don't retain the queries, they might be
   * garbage collected before we've had a chance to store things, and we might
   * encounter missing entries when going offline. Hence the manual memory
   * mangement.
   */
  disposableQueries: [],
}

// Safe timeout for fetches, so that the PromisePool doesn't clog
const FILE_DOWNLOAD_POOL_TIMEOUT = 10000
const MAX_QUERY_CONCURRENCY = 50
const MAX_FILE_DOWNLOAD_CONCURRENCY = 10

export interface SyncManagerOptions {
  onAbort: (abortHandler: () => void) => void
  onComplete: () => void
  onStart: () => void
  onStepChange: (progress: { current: number; total: number }) => void
  onStatusChange: (message: string) => void
  onProgressChange: (progress: number) => void
  onSyncResultsChange: (
    results: SyncResultsData | { imagesDownloaded: Record<string, string> }
  ) => void
  partnerID: string
  relayEnvironment: RelayModernEnvironment
}

export function initSyncManager({
  onAbort,
  onComplete,
  onProgressChange,
  onStart,
  onStatusChange,
  onStepChange,
  onSyncResultsChange,
  partnerID,
  relayEnvironment,
}: SyncManagerOptions) {
  if (!partnerID) {
    throw new Error("[sync] Error initializing sync: `partnerID` is required")
  }

  let syncAborted = false

  const { fetchOrCatch } = initFetchOrCatch({
    relayEnvironment,
    checkIfAborted: () => syncAborted,
    onError: (error) => {
      syncResults.queryErrors.push(error)
    },
    onComplete: (disposableQuery) => {
      syncResults.disposableQueries.push(disposableQuery)
    },
  })

  const { downloadFileToCache } = initDownloadFileToCache({
    onFileDownloadError: (file) => {
      syncResults.fileDownloadErrors.push(file)
    },
  })

  const updateStatus = (...messages: any[]) => {
    log(...messages)

    onStatusChange(messages[0])
  }

  // Noticed that sometimes the `Error.captureStackTrace` is not available when
  // running on the device. This is a workaround to make sure it's available and
  // so that the app doesn't crash if encountering errors during sync.
  if (!("captureStackTrace" in Error)) {
    ;(Error as any).captureStackTrace = log
  }

  const handleAbortSync = () => {
    syncAborted = true
    log("Aborting sync")
  }

  // Pass abort sync function back to parent
  onAbort(() => handleAbortSync)

  const startSync = async () => {
    updateStatus("Starting sync")

    const currentSyncProgress = await getCurrentSyncProgress()

    onStart()

    /**
     * Add all queries to be synced here
     */
    const syncTargets = [
      syncArtistsQuery,
      syncShowsQuery,

      // Sub-queries. Order matters
      syncArtistArtworksQuery,
      syncArtworkQuery,
      syncArtistShowsQuery,
      syncArtistDocumentsQuery,
      syncShowTabsQuery,
      syncPartnerShowTabsQuery,
      syncShowArtworksQuery,
      syncShowInstallsQuery,
      syncShowDocumentsQuery,

      // Retry errors caught above 3 times
      retryQueriesForErrors,

      // Media sync. We collect all urls from the queries above and sync the
      // images, install shots, and documents last.
      syncImages,
      syncInstallShots,
      syncDocuments,

      // Retry download errors caught above 3 times
      retryFileDownloadsForErrors,
    ]

    // Since some items depend on the next, fetch the above sequentially.
    // Internally, for things like artist images, we fetch in parallel.
    for (const [index, fetchSyncTargetData] of syncTargets.entries()) {
      try {
        if (syncAborted) {
          return
        }

        // If we've already started a sync and cancelled or errored out, skip
        // initial steps and jump to where we left off.
        if (index < currentSyncProgress.currentStep) {
          continue
        }

        // Reset progress
        onProgressChange(0)

        onStepChange({
          current: index + 1,
          total: syncTargets.length,
        })

        await fetchSyncTargetData()

        // Persist the data incrementally after each step
        await saveRelayDataToOfflineCache({
          relayEnvironment,
          persistStepForResume: index,
          syncAborted,
        })

        onSyncResultsChange(syncResults)

        // Ensure the bar completes
        onProgressChange(100)

        // Slight delay so that we have time to reset progress
        await delay(300)
      } catch (error) {
        updateStatus(`Error while performing sync: ${error}`)
      }
    }

    // Store the data in the cache. Later, if the user is offline they'll be
    // able to read from this store.
    await saveRelayDataToOfflineCache({
      relayEnvironment,
      syncAborted,
    })

    // Reset sync progress so fresh syncs can occur
    await clearSyncProgressFileCache()

    // Dispose of the completed relay query to free up memory
    syncResults.disposableQueries.forEach((disposable) => {
      disposable.dispose()
    })

    onComplete()

    log("* Sync complete. *")
  }

  /**
   * Top-level tabs
   */

  const syncArtistsQuery = async () => {
    updateStatus("Syncing artists")

    // Manually setting progress since we're not using a PromisePool
    onProgressChange(0)

    syncResults.artistsListQuery = await fetchOrCatch<ArtistsListQuery>(
      artistsListQuery,
      {
        partnerID,
      }
    )

    onProgressChange(100)

    log("Complete. `artistsListQuery`", syncResults.artistsListQuery)
  }

  const syncShowsQuery = async () => {
    updateStatus("Syncing shows")

    onProgressChange(0)

    syncResults.showsTabQuery = await fetchOrCatch<ShowsTabQuery>(
      showsTabQuery,
      {
        partnerID,
      }
    )

    onProgressChange(100)

    log("Complete. `showsTabQuery`", syncResults.showsTabQuery)
  }

  /**
   * Sub-queries
   */

  const syncArtistArtworksQuery = async () => {
    const artistSlugs = parsers.getArtistSlugs()

    const { results } = await PromisePool.for(artistSlugs)
      .onTaskStarted(reportProgress("Syncing artist artworks"))
      .withConcurrency(MAX_QUERY_CONCURRENCY)
      .process(async (slug, _index, pool) => {
        if (syncAborted) {
          pool.stop()
          return
        }

        return await fetchOrCatch<ArtistArtworksOfflineQuery>(
          artistArtworksOfflineQuery,
          {
            partnerID,
            slug,
          }
        )
      })

    syncResults.artistArtworksQuery = compact(results)

    log("Complete. `artistArtworksQuery`", syncResults.artistArtworksQuery)
  }

  const syncArtworkQuery = async () => {
    const artworkSlugs = parsers.getArtistArtworkSlugs()

    const { results } = await PromisePool.for(artworkSlugs)
      .onTaskStarted(reportProgress("Syncing artist artwork content"))
      .withConcurrency(MAX_QUERY_CONCURRENCY)
      .process(async (slug, _index, pool) => {
        if (syncAborted) {
          pool.stop()
          return
        }

        return await fetchOrCatch<ArtworkQuery>(artworkQuery, {
          slug,
        })
      })

    syncResults.artworkQuery = compact(results)

    log("Complete. `artistArtworksContentData`", syncResults.artworkQuery)
  }

  const syncArtistShowsQuery = async () => {
    const artistSlugs = parsers.getArtistSlugs()

    const { results } = await PromisePool.for(artistSlugs)
      .onTaskStarted(reportProgress("Syncing artist shows"))
      .withConcurrency(MAX_QUERY_CONCURRENCY)
      .process(async (slug, _index, pool) => {
        if (syncAborted) {
          pool.stop()
          return
        }

        return (await fetchOrCatch<ArtistShowsQuery>(artistShowsQuery, {
          partnerID,
          slug,
        })) as ArtistShowsQuery$rawResponse
      })

    syncResults.artistShowsQuery = compact(results)

    log("Complete. `artistShowsQuery`", syncResults.artistShowsQuery)
  }

  const syncShowTabsQuery = async () => {
    const artistShowSlugs = parsers.getArtistShowSlugs()

    const { results } = await PromisePool.for(artistShowSlugs)
      .onTaskStarted(reportProgress("Syncing show tabs"))
      .withConcurrency(MAX_QUERY_CONCURRENCY)
      .process(async (slug, _index, pool) => {
        if (syncAborted) {
          pool.stop()
          return
        }

        return await fetchOrCatch<ShowTabsQuery>(showTabsQuery, { slug })
      })

    syncResults.showTabsQuery = compact(results)

    log("Complete. `showTabsQuery`", syncResults.showTabsQuery)
  }

  const syncArtistDocumentsQuery = async () => {
    const artistSlugs = parsers.getArtistSlugs()

    const { results } = await PromisePool.for(artistSlugs)
      .onTaskStarted(reportProgress("Syncing artist documents"))
      .withConcurrency(MAX_QUERY_CONCURRENCY)
      .process(async (slug, _index, pool) => {
        if (syncAborted) {
          pool.stop()
          return
        }

        return await fetchOrCatch<ArtistDocumentsQuery>(artistDocumentsQuery, {
          partnerID,
          slug,
        })
      })

    syncResults.artistDocumentsQuery = compact(results)

    log("Complete. `artistDocumentsQuery`", syncResults.artistDocumentsQuery)
  }

  const syncPartnerShowTabsQuery = async () => {
    const showSlugs = parsers.getShowSlugs()

    const { results } = await PromisePool.for(showSlugs)
      .onTaskStarted(reportProgress("Syncing partner shows"))
      .withConcurrency(MAX_QUERY_CONCURRENCY)
      .process(async (slug, _index, pool) => {
        if (syncAborted) {
          pool.stop()
          return
        }

        return await fetchOrCatch<ShowTabsQuery>(showTabsQuery, { slug })
      })

    syncResults.partnerShowTabsQuery = compact(results)

    log("Complete. `partnerShowTabsQuery`", syncResults.partnerShowTabsQuery)
  }

  const syncShowArtworksQuery = async () => {
    const showSlugs = parsers.getShowSlugs()

    const { results } = await PromisePool.for(showSlugs)
      .onTaskStarted(reportProgress("Syncing show artworks"))
      .withConcurrency(MAX_QUERY_CONCURRENCY)
      .process(async (slug, _index, pool) => {
        if (syncAborted) {
          pool.stop()
          return
        }

        return await fetchOrCatch<ShowArtworksOfflineQuery>(
          showArtworksOfflineQuery,
          {
            slug,
          }
        )
      })

    syncResults.showArtworksQuery = compact(results)

    log("Complete. `showArtworksQuery`", syncResults.showArtworksQuery)
  }

  const syncShowInstallsQuery = async () => {
    const showSlugs = parsers.getShowSlugs()

    const { results } = await PromisePool.for(showSlugs)
      .onTaskStarted(reportProgress("Syncing show installs"))
      .withConcurrency(MAX_QUERY_CONCURRENCY)
      .process(async (slug, _index, pool) => {
        if (syncAborted) {
          pool.stop()
          return
        }

        return await fetchOrCatch<ShowInstallsQuery>(showInstallsQuery, {
          slug,
        })
      })

    syncResults.showInstallsQuery = compact(results)

    log("Complete. `showInstallsQuery`", syncResults.showInstallsQuery)
  }

  const syncShowDocumentsQuery = async () => {
    const showSlugs = parsers.getShowSlugs()

    const { results } = await PromisePool.for(showSlugs)
      .onTaskStarted(reportProgress("Syncing show documents"))
      .withConcurrency(MAX_QUERY_CONCURRENCY)
      .process(async (slug, _index, pool) => {
        if (syncAborted) {
          pool.stop()
          return
        }

        return fetchOrCatch<ShowDocumentsQuery>(showDocumentsQuery, {
          slug,
          partnerID,
        })
      })

    syncResults.showDocumentsQuery = compact(results)

    log("Complete. `showDocumentsQuery`", syncResults.showDocumentsQuery)
  }

  /**
   * Media sync, such as images, install shots, and documents
   */

  const syncImages = async () => {
    const urls = parsers.getImageUrls()

    // The current index of the image being downloaded
    let currentIndex = 0

    const getCurrentIndex = () => {
      return currentIndex
    }

    await PromisePool.for(urls)
      .onTaskStarted(
        reportProgress("Syncing images", {
          showMeta: true,
          getCurrentIndex,
          totalCount: urls.length - 1,
        })
      )
      .withConcurrency(MAX_FILE_DOWNLOAD_CONCURRENCY)
      .withTaskTimeout(FILE_DOWNLOAD_POOL_TIMEOUT)
      .process(async (url, index, pool) => {
        if (syncAborted) {
          pool.stop()
          return
        }

        if (__DEV__) {
          currentIndex = index

          // For logging results to help debugging
          onSyncResultsChange({
            imagesDownloaded: getURLMap(),
            ...syncResults,
          })
        }
        return await downloadFileToCache({
          type: "image",
          url,
        })
      })
  }

  const syncInstallShots = async () => {
    const urls = parsers.getInstallShotUrls()

    await PromisePool.for(urls)
      .onTaskStarted(reportProgress("Syncing install shots"))
      .withConcurrency(MAX_FILE_DOWNLOAD_CONCURRENCY)
      .withTaskTimeout(FILE_DOWNLOAD_POOL_TIMEOUT)
      .process(async (url, _index, pool) => {
        if (syncAborted) {
          pool.stop()
          return
        }

        return await downloadFileToCache({
          type: "image",
          url,
        })
      })
  }

  const syncDocuments = async () => {
    const urls = parsers.getDocumentsUrls()
    const accessToken = GlobalStore.getState().auth.userAccessToken!

    await PromisePool.for(urls)
      .onTaskStarted(reportProgress("Syncing documents"))
      .withConcurrency(MAX_FILE_DOWNLOAD_CONCURRENCY)
      .withTaskTimeout(FILE_DOWNLOAD_POOL_TIMEOUT)
      .process(async (url, _index, pool) => {
        if (syncAborted) {
          pool.stop()
          return
        }

        return await downloadFileToCache({
          type: "document",
          url,
          accessToken,
        })
      })
  }

  /**
   * Retry operations
   */

  const retryQueriesForErrors = async () => {
    await retryOperation<FetchError>({
      errors: syncResults.queryErrors,
      execute: async ({ query, variables }, _index, pool) => {
        if (syncAborted) {
          pool.stop()
          return
        }

        await fetchOrCatch(query, variables)

        // Ensure that the progress bar is at 100% when we're done
        onProgressChange(100)
      },
      onStart: () => {
        syncResults.queryErrors = []
      },
      shouldRetry: () => {
        return syncResults.queryErrors.length > 0 && !syncAborted
      },
      updateStatus: () => updateStatus("Validating data."),
      reportProgress: () => reportProgress("Retrying failed"),
    })
  }

  const retryFileDownloadsForErrors = async () => {
    await retryOperation<DownloadFileToCacheProps>({
      errors: syncResults.fileDownloadErrors,
      execute: async (file, _index, pool) => {
        if (syncAborted) {
          pool.stop()
          return
        }

        await downloadFileToCache(file)

        onProgressChange(100)
      },
      onStart: () => {
        syncResults.fileDownloadErrors = []
      },
      shouldRetry: () => {
        return syncResults.fileDownloadErrors.length > 0 && !syncAborted
      },
      updateStatus: () => updateStatus("Validating downloads."),
      reportProgress: () => reportProgress("Retrying download"),
    })
  }

  const reportProgress = (
    message: string,
    options: {
      showMeta?: boolean
      getCurrentIndex?: () => number
      totalCount?: number
    } = {}
  ) => {
    const onProgressCallback: OnProgressCallback<string> = (_, pool) => {
      if (__DEV__ && options.showMeta) {
        // Output the total count and current index for debugging
        onStatusChange(
          `${message} (${options.getCurrentIndex?.()} - ${options.totalCount})`
        )
      } else {
        onStatusChange(message)
      }

      onProgressChange(Math.floor(pool.processedPercentage()))
    }
    return onProgressCallback
  }

  return {
    startSync,
  }
}

/**
 * Parsers for extracting data from sync results
 */

const parsers = {
  getArtistSlugs: (): string[] => {
    const artists = extractNodes(
      syncResults.artistsListQuery?.partner?.allArtistsConnection
    )

    const artistSlugs = compact(
      artists.map((artist) => {
        return artist.slug
      })
    )

    return artistSlugs
  },

  getArtistArtworkSlugs: (): string[] => {
    const artworks = syncResults.artistArtworksQuery?.flatMap(
      (artistArtworks) => {
        return extractNodes(artistArtworks.partner?.artworksConnection)
      }
    )

    if (!artworks) {
      return []
    }

    const artworkSlugs = compact(
      artworks.map((artwork) => {
        return artwork.slug
      })
    )

    return artworkSlugs
  },

  getArtistShowSlugs: (): string[] => {
    const shows = syncResults.artistShowsQuery?.flatMap((artistShows) => {
      return extractNodes(artistShows.partner?.showsConnection)
    })

    if (!shows) {
      return []
    }

    const showSlugs = compact(
      shows.map((show) => {
        return show.slug
      })
    )

    return showSlugs
  },

  getShowSlugs: (): string[] => {
    const shows = extractNodes(
      syncResults.showsTabQuery?.partner?.showsConnection
    )

    const showSlugs = compact(
      shows.map((show) => {
        return show.slug
      })
    )

    return showSlugs
  },

  getImageUrls: (): string[] => {
    const imageUrls = compact([
      ...(syncResults.artworkQuery ?? []).flatMap((artworkContent) => [
        artworkContent?.artwork?.image?.resized?.url!,
        artworkContent?.artwork?.artist?.image?.resized?.url!,
      ]),
      ...extractNodes(syncResults.showsTabQuery?.partner?.showsConnection).map(
        (show) => {
          return show?.coverImage?.url
        }
      ),
    ])

    return imageUrls
  },

  getInstallShotUrls: (): string[] => {
    const installShotUrls = compact(
      (syncResults.artistShowsQuery ?? [])
        .flatMap((artistShows) =>
          extractNodes(artistShows.partner?.showsConnection)
        )
        .map((show) => show.coverImage?.url!)
    )

    return installShotUrls
  },

  getDocumentsUrls: (): string[] => {
    const documentsUrls = compact(
      (syncResults.artistDocumentsQuery ?? [])
        .flatMap((artistDocs) =>
          extractNodes(artistDocs.partner?.documentsConnection)
        )
        .map((doc) => doc.publicURL)
    )

    return documentsUrls
  },
}

const log = (...messages: any[]) => console.log("\n[sync]:", ...messages)

/**
 * Create and save the Relay store to disk
 */

interface SaveRelayDataToOfflineCacheProps {
  /**
   * This is used to persist the current step in the sync process. If the sync
   * is cancelled at any point, we can read the current step from disk and
   * resume where we left off.
   */
  persistStepForResume?: number
  relayEnvironment: RelayModernEnvironment
  syncAborted?: boolean
}

export const saveRelayDataToOfflineCache = async ({
  relayEnvironment,
  persistStepForResume,
  syncAborted,
}: SaveRelayDataToOfflineCacheProps) => {
  if (syncAborted) {
    return
  }

  log("Persisting data to offline cache. Step: ", persistStepForResume)

  const relayData = relayEnvironment.getStore().getSource().toJSON()

  await saveFileToCache({
    data: JSON.stringify(relayData),
    filename: JSON_FILES.relayData,
    type: "json",
  })

  // Store metadata about current sync progress
  if (persistStepForResume) {
    await saveFileToCache({
      data: `{ "currentStep": ${persistStepForResume} }`,
      filename: JSON_FILES.syncProgress,
      type: "json",
    })
  }
}

export const loadRelayDataFromOfflineCache = (
  resetRelayEnvironment: RelayContextProps["resetRelayEnvironment"],
  onComplete?: () => void
) => {
  getFileFromCache({ filename: JSON_FILES.relayData, type: "json" })
    .then((data) => {
      log("Loading relay data from cache.")

      if (data) {
        resetRelayEnvironment(JSON.parse(data))
      } else {
        showOfflineAlert()
      }
    })
    .catch((error) => {
      log("Error loading offline relay data from sync", error)
    })
    .finally(() => {
      onComplete?.()
    })
}

const showOfflineAlert = once(() => {
  Alert.alert(
    "Set Up Offline Mode",
    "You are currently offline, but do not have offline mode activated. When you're online again, set it up in Settings > Offline Mode.",
    [
      {
        text: "OK",
        style: "cancel",
      },
    ]
  )
})

export const tests = {
  parsers,
  syncResults,
  saveRelayDataToOfflineCache,
}
