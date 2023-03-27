import { PromisePool, OnProgressCallback } from "@supercharge/promise-pool"
import {
  ArtistArtworksQuery,
  ArtistArtworksQuery$data,
} from "__generated__/ArtistArtworksQuery.graphql"
import {
  ArtistDocumentsQuery,
  ArtistDocumentsQuery$data,
} from "__generated__/ArtistDocumentsQuery.graphql"
import {
  ArtistShowsQuery,
  ArtistShowsQuery$rawResponse,
} from "__generated__/ArtistShowsQuery.graphql"
import { ArtistsListQuery, ArtistsListQuery$data } from "__generated__/ArtistsListQuery.graphql"
import {
  ArtworkImageModalQuery,
  ArtworkImageModalQuery$data,
} from "__generated__/ArtworkImageModalQuery.graphql"
import { ArtworkQuery, ArtworkQuery$data } from "__generated__/ArtworkQuery.graphql"
import { ShowArtworksQuery, ShowArtworksQuery$data } from "__generated__/ShowArtworksQuery.graphql"
import {
  ShowDocumentsQuery,
  ShowDocumentsQuery$data,
} from "__generated__/ShowDocumentsQuery.graphql"
import { ShowInstallsQuery, ShowInstallsQuery$data } from "__generated__/ShowInstallsQuery.graphql"
import { ShowTabsQuery, ShowTabsQuery$data } from "__generated__/ShowTabsQuery.graphql"
import { ShowsQuery, ShowsQuery$data } from "__generated__/ShowsQuery.graphql"
import { artworkImageModalQuery } from "components/ArtworkImageModal"
import { artistsListQuery } from "components/Lists/ArtistsList"
import { compact, once } from "lodash"
import { Alert } from "react-native"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { artistArtworksQuery } from "screens/Artists/ArtistTabs/ArtistArtworks"
import { artistDocumentsQuery } from "screens/Artists/ArtistTabs/ArtistDocuments"
import { artistShowsQuery } from "screens/Artists/ArtistTabs/ArtistShows"
import { artworkQuery } from "screens/Artwork/Artwork"
import { showArtworksQuery } from "screens/Shows/ShowTabs/ShowArtworks"
import { showDocumentsQuery } from "screens/Shows/ShowTabs/ShowDocuments"
import { showInstallsQuery } from "screens/Shows/ShowTabs/ShowInstalls"
import { showTabsQuery } from "screens/Shows/ShowTabs/ShowTabs"
import { showsQuery } from "screens/Shows/Shows"
import { RelayContextProps } from "system/relay/RelayProvider"
import { GlobalStore } from "system/store/GlobalStore"
import {
  clearFileCache,
  initDownloadFileToCache,
  getFileFromCache,
  saveFileToCache,
  DownloadFileToCacheProps,
  getURLMap,
} from "system/sync/fileCache"
import { retryOperation } from "system/sync/retryOperation"
import { FetchError, initFetchOrCatch } from "system/sync/utils/fetchOrCatch"
import { extractNodes } from "utils/extractNodes"
import { imageSize } from "utils/imageSize"

export interface SyncResultsData {
  artistsListQuery?: ArtistsListQuery$data
  showsQuery?: ShowsQuery$data
  artistArtworksQuery?: ArtistArtworksQuery$data[]
  artworkQuery?: ArtworkQuery$data[]
  artworkImageModalQuery?: ArtworkImageModalQuery$data[]
  artistShowsQuery?: ArtistShowsQuery$rawResponse[]
  showTabsQuery?: ShowTabsQuery$data[]
  artistDocumentsQuery?: ArtistDocumentsQuery$data[]
  partnerShowTabsQuery?: ShowTabsQuery$data[]
  showArtworksQuery?: ShowArtworksQuery$data[]
  showInstallsQuery?: ShowInstallsQuery$data[]
  showDocumentsQuery?: ShowDocumentsQuery$data[]
  queryErrors: FetchError[]
  fileDownloadErrors: DownloadFileToCacheProps[]
}

/**
 * Intial sync results data
 */
const syncResults: SyncResultsData = {
  artistsListQuery: undefined,
  showsQuery: undefined,
  artistArtworksQuery: [],
  artworkQuery: [],
  artworkImageModalQuery: [],
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
}

// Safe timeout for fetches, so that the PromisePool doesn't clog
const FILE_DOWNLOAD_POOL_TIMEOUT = 10000
const MAX_QUERY_CONCURRENCY = 50
const MAX_FILE_DOWNLOAD_CONCURRENCY = 20

interface SyncManagerOptions {
  onComplete: () => void
  onProgress: (currentProgress: string | number) => void
  onStart: () => void
  onStatusChange: (message: string) => void
  onSyncResultsChange: (
    results: SyncResultsData | { imagesDownloaded: Record<string, string> }
  ) => void
  partnerID: string
  relayEnvironment: RelayModernEnvironment
}

export function initSyncManager({
  onComplete,
  onStart,
  onProgress,
  onStatusChange,
  onSyncResultsChange,
  partnerID,
  relayEnvironment,
}: SyncManagerOptions) {
  if (!partnerID) {
    throw new Error("[sync] Error initializing sync: `partnerID` is required")
  }

  const { fetchOrCatch } = initFetchOrCatch({
    relayEnvironment,
    onError: (error) => {
      syncResults.queryErrors.push(error)
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

  const startSync = async () => {
    updateStatus("Starting sync")

    // Be sure we're starting from scratch
    await clearFileCache()

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
      syncImageModalQuery,
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
        onProgress(`${index}/${syncTargets.length}`)

        await fetchSyncTargetData()

        // Persist the data incrementally after each step
        await saveRelayDataToOfflineCache(relayEnvironment)

        onSyncResultsChange(syncResults)
      } catch (error) {
        updateStatus(`Error while performing sync: ${error}`)
      }
    }

    // Store the data in the cache. Later, if the user is offline they'll be
    // able to read from this store.
    await saveRelayDataToOfflineCache(relayEnvironment)

    onComplete()

    log("* Sync complete. *")
  }

  /**
   * Top-level tabs
   */

  const syncArtistsQuery = async () => {
    updateStatus("Syncing artists")

    syncResults.artistsListQuery = await fetchOrCatch<ArtistsListQuery>(artistsListQuery, {
      partnerID,
    })

    updateStatus("Complete. `artistsListQuery`", syncResults.artistsListQuery)
  }

  const syncShowsQuery = async () => {
    updateStatus("Syncing shows")

    syncResults.showsQuery = await fetchOrCatch<ShowsQuery>(showsQuery, {
      partnerID,
    })

    updateStatus("Complete. `showsTabQuery`", syncResults.showsQuery)
  }

  /**
   * Sub-queries
   */

  const syncArtistArtworksQuery = async () => {
    const artistSlugs = parsers.getArtistSlugs()

    const { results } = await PromisePool.for(artistSlugs)
      .onTaskStarted(reportProgress("Syncing artist artworks"))
      .withConcurrency(MAX_QUERY_CONCURRENCY)
      .process(async (slug) => {
        return await fetchOrCatch<ArtistArtworksQuery>(artistArtworksQuery, {
          partnerID,
          slug,
        })
      })

    syncResults.artistArtworksQuery = compact(results)

    updateStatus("Complete. `artistArtworksQuery`", syncResults.artistArtworksQuery)
  }

  const syncArtworkQuery = async () => {
    const artworkSlugs = parsers.getArtistArtworkSlugs()

    const { results } = await PromisePool.for(artworkSlugs)
      .onTaskStarted(reportProgress("Syncing artist artwork content"))
      .withConcurrency(MAX_QUERY_CONCURRENCY)
      .process(async (slug) => {
        return await fetchOrCatch<ArtworkQuery>(artworkQuery, {
          slug,
        })
      })

    syncResults.artworkQuery = compact(results)

    updateStatus("Complete. `artistArtworksContentData`", syncResults.artworkQuery)
  }

  const syncImageModalQuery = async () => {
    const artworkSlugs = parsers.getArtistArtworkSlugs()

    const { results } = await PromisePool.for(artworkSlugs)
      .onTaskStarted(reportProgress("Syncing image content"))
      .withConcurrency(MAX_QUERY_CONCURRENCY)
      .process(async (slug) => {
        return await fetchOrCatch<ArtworkImageModalQuery>(artworkImageModalQuery, {
          slug,
          imageSize,
        })
      })

    syncResults.artworkImageModalQuery = compact(results)

    updateStatus("Complete. `artworkImageModalQuery`", syncResults.artworkImageModalQuery)
  }

  const syncArtistShowsQuery = async () => {
    const artistSlugs = parsers.getArtistSlugs()

    const { results } = await PromisePool.for(artistSlugs)
      .onTaskStarted(reportProgress("Syncing artist shows"))
      .withConcurrency(MAX_QUERY_CONCURRENCY)
      .process(async (slug) => {
        return (await fetchOrCatch<ArtistShowsQuery>(artistShowsQuery, {
          partnerID,
          slug,
        })) as ArtistShowsQuery$rawResponse
      })

    syncResults.artistShowsQuery = compact(results)

    updateStatus("Complete. `artistShowsQuery`", syncResults.artistShowsQuery)
  }

  const syncShowTabsQuery = async () => {
    const artistShowSlugs = parsers.getArtistShowSlugs()

    const { results } = await PromisePool.for(artistShowSlugs)
      .onTaskStarted(reportProgress("Syncing show tabs"))
      .withConcurrency(MAX_QUERY_CONCURRENCY)
      .process(async (slug) => {
        return await fetchOrCatch<ShowTabsQuery>(showTabsQuery, { slug })
      })

    syncResults.showTabsQuery = compact(results)

    updateStatus("Complete. `showTabsQuery`", syncResults.showTabsQuery)
  }

  const syncArtistDocumentsQuery = async () => {
    const artistSlugs = parsers.getArtistSlugs()

    const { results } = await PromisePool.for(artistSlugs)
      .onTaskStarted(reportProgress("Syncing artist documents"))
      .withConcurrency(MAX_QUERY_CONCURRENCY)
      .process(async (slug) => {
        return await fetchOrCatch<ArtistDocumentsQuery>(artistDocumentsQuery, {
          partnerID,
          slug,
        })
      })

    syncResults.artistDocumentsQuery = compact(results)

    updateStatus("Complete. `artistDocumentsQuery`", syncResults.artistDocumentsQuery)
  }

  const syncPartnerShowTabsQuery = async () => {
    const showSlugs = parsers.getShowSlugs()

    const { results } = await PromisePool.for(showSlugs)
      .onTaskStarted(reportProgress("Syncing partner shows"))
      .withConcurrency(MAX_QUERY_CONCURRENCY)
      .process(async (slug) => {
        return await fetchOrCatch<ShowTabsQuery>(showTabsQuery, { slug })
      })

    syncResults.partnerShowTabsQuery = compact(results)

    updateStatus("Complete. `partnerShowTabsQuery`", syncResults.partnerShowTabsQuery)
  }

  const syncShowArtworksQuery = async () => {
    const showSlugs = parsers.getShowSlugs()

    const { results } = await PromisePool.for(showSlugs)
      .onTaskStarted(reportProgress("Syncing show artworks"))
      .withConcurrency(MAX_QUERY_CONCURRENCY)
      .process(async (slug) => {
        return await fetchOrCatch<ShowArtworksQuery>(showArtworksQuery, { slug })
      })

    syncResults.showArtworksQuery = compact(results)

    updateStatus("Complete. `showArtworksQuery`", syncResults.showArtworksQuery)
  }

  const syncShowInstallsQuery = async () => {
    const showSlugs = parsers.getShowSlugs()

    const { results } = await PromisePool.for(showSlugs)
      .onTaskStarted(reportProgress("Syncing show installs"))
      .withConcurrency(MAX_QUERY_CONCURRENCY)
      .process(async (slug) => {
        return await fetchOrCatch<ShowInstallsQuery>(showInstallsQuery, { slug })
      })

    syncResults.showInstallsQuery = compact(results)

    updateStatus("Complete. `showInstallsQuery`", syncResults.showInstallsQuery)
  }

  const syncShowDocumentsQuery = async () => {
    const showSlugs = parsers.getShowSlugs()

    const { results } = await PromisePool.for(showSlugs)
      .onTaskStarted(reportProgress("Syncing show documents"))
      .withConcurrency(MAX_QUERY_CONCURRENCY)
      .process(async (slug) => {
        return fetchOrCatch<ShowDocumentsQuery>(showDocumentsQuery, { slug, partnerID })
      })

    syncResults.showDocumentsQuery = compact(results)

    updateStatus("Complete. `showDocumentsQuery`", syncResults.showDocumentsQuery)
  }

  /**
   * Media sync, such as images, install shots, and documents
   */

  const syncImages = async () => {
    const urls = parsers.getImageUrls()

    await PromisePool.for(urls)
      .onTaskStarted(reportProgress("Syncing images"))
      .withConcurrency(MAX_FILE_DOWNLOAD_CONCURRENCY)
      .withTaskTimeout(FILE_DOWNLOAD_POOL_TIMEOUT)
      .process(async (url) => {
        if (__DEV__) {
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
      .process(async (url) => {
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
      .process(async (url) => {
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
      execute: async ({ query, variables }) => {
        await fetchOrCatch(query, variables)
      },
      onStart: () => {
        syncResults.queryErrors = []
      },
      shouldRetry: () => {
        return syncResults.queryErrors.length > 0
      },
      updateStatus: () => updateStatus("Validating data."),
      reportProgress: () => reportProgress("Retrying failed"),
    })
  }

  const retryFileDownloadsForErrors = async () => {
    await retryOperation<DownloadFileToCacheProps>({
      errors: syncResults.fileDownloadErrors,
      execute: async (file) => {
        await downloadFileToCache(file)
      },
      onStart: () => {
        syncResults.fileDownloadErrors = []
      },
      shouldRetry: () => {
        return syncResults.fileDownloadErrors.length > 0
      },
      updateStatus: () => updateStatus("Validating downloads."),
      reportProgress: () => reportProgress("Retrying download"),
    })
  }

  const reportProgress = (message: string) => {
    const onProgressCallback: OnProgressCallback<string> = (_, pool) => {
      onStatusChange(`${message}: ${Math.floor(pool.processedPercentage())}%`)
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
    const artists = extractNodes(syncResults.artistsListQuery?.partner?.allArtistsConnection)

    const artistSlugs = compact(
      artists.map((artist) => {
        return artist.slug
      })
    )

    return artistSlugs
  },

  getArtistArtworkSlugs: (): string[] => {
    const artworks = syncResults.artistArtworksQuery?.flatMap((artistArtworks) => {
      return extractNodes(artistArtworks.partner?.artworksConnection)
    })

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
    const shows = extractNodes(syncResults.showsQuery?.partner?.showsConnection)

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
        artworkContent?.artwork?.artist?.imageUrl!,
      ]),
      ...extractNodes(syncResults.showsQuery?.partner?.showsConnection).map((show) => {
        return show?.coverImage?.url
      }),
      ...(syncResults.artworkImageModalQuery ?? []).map(({ artwork }) => {
        return artwork?.image?.resized?.url
      }),
    ])

    return imageUrls
  },

  getInstallShotUrls: (): string[] => {
    const installShotUrls = compact(
      (syncResults.artistShowsQuery ?? [])
        .flatMap((artistShows) => extractNodes(artistShows.partner?.showsConnection))
        .map((show) => show.coverImage?.url!)
    )

    return installShotUrls
  },

  getDocumentsUrls: (): string[] => {
    const documentsUrls = compact(
      (syncResults.artistDocumentsQuery ?? [])
        .flatMap((artistDocs) => extractNodes(artistDocs.partner?.documentsConnection))
        .map((doc) => doc.publicURL)
    )

    return documentsUrls
  },
}

const log = (...messages: any[]) => console.log("\n[sync]:", ...messages)

/**
 * Create and save the Relay store to disk
 */

const saveRelayDataToOfflineCache = async (relayEnvironment: RelayModernEnvironment) => {
  log("Persisting data to offline cache")

  const relayData = relayEnvironment.getStore().getSource().toJSON()

  await saveFileToCache({
    data: JSON.stringify(relayData),
    filename: "relayData.json",
    type: "relayData",
  })
}

export const loadRelayDataFromOfflineCache = (
  resetRelayEnvironment: RelayContextProps["resetRelayEnvironment"]
) => {
  getFileFromCache({ filename: "relayData.json", type: "relayData" })
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

export const _tests = {
  syncResults,
  parsers,
  saveRelayDataToOfflineCache,
}
