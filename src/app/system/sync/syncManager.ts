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
import { ArtistTabsQuery, ArtistTabsQuery$data } from "__generated__/ArtistTabsQuery.graphql"
import { ArtistsQuery, ArtistsQuery$data } from "__generated__/ArtistsQuery.graphql"
import {
  ArtworkContentQuery,
  ArtworkContentQuery$data,
} from "__generated__/ArtworkContentQuery.graphql"
import { ShowArtworksQuery, ShowArtworksQuery$data } from "__generated__/ShowArtworksQuery.graphql"
import {
  ShowDocumentsQuery,
  ShowDocumentsQuery$data,
} from "__generated__/ShowDocumentsQuery.graphql"
import { ShowInstallsQuery, ShowInstallsQuery$data } from "__generated__/ShowInstallsQuery.graphql"
import { ShowTabsQuery, ShowTabsQuery$data } from "__generated__/ShowTabsQuery.graphql"
import { ShowsQuery, ShowsQuery$data } from "__generated__/ShowsQuery.graphql"
import { artistArtworksQuery } from "app/screens/Artists/ArtistTabs/ArtistArtworks/ArtistArtworks"
import { artistDocumentsQuery } from "app/screens/Artists/ArtistTabs/ArtistDocuments/ArtistDocuments"
import { artistShowsQuery } from "app/screens/Artists/ArtistTabs/ArtistShows/ArtistShows"
import { artistTabsQuery } from "app/screens/Artists/ArtistTabs/ArtistTabs"
import { artistsQuery } from "app/screens/Artists/Artists"
import { artworkContentQuery } from "app/screens/Artwork/ArtworkContent/ArtworkContent"
import { showArtworksQuery } from "app/screens/Shows/ShowTabs/ShowArtworks/ShowArtworks"
import { showDocumentsQuery } from "app/screens/Shows/ShowTabs/ShowDocuments/ShowDocuments"
import { showInstallsQuery } from "app/screens/Shows/ShowTabs/ShowInstalls/ShowInstalls"
import { showTabsQuery } from "app/screens/Shows/ShowTabs/ShowTabs"
import { showsQuery } from "app/screens/Shows/Shows"
import { RelayContextProps } from "app/system/relay/RelayProvider"
import { GlobalStore } from "app/system/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { imageSize } from "app/utils/imageSize"
import { compact, once, uniqBy } from "lodash"
import { Alert } from "react-native"
import { RelayNetworkLayerRequest } from "react-relay-network-modern"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { getFileFromCache, saveFileToCache, downloadFileToCache } from "./fileCache"
import { FetchError, initFetchOrCatch } from "./utils/fetchOrCatch"

interface SyncResultsData {
  artistsQuery?: ArtistsQuery$data
  showsQuery?: ShowsQuery$data
  artistTabsQuery?: ArtistTabsQuery$data[]
  artistArtworksQuery?: ArtistArtworksQuery$data[]
  artworkContentQuery?: ArtworkContentQuery$data[]
  artistShowsQuery?: ArtistShowsQuery$rawResponse[]
  showTabsQuery?: ShowTabsQuery$data[]
  artistDocumentsQuery?: ArtistDocumentsQuery$data[]
  partnerShowTabsQuery?: ShowTabsQuery$data[]
  showArtworksQuery?: ShowArtworksQuery$data[]
  showInstallsQuery?: ShowInstallsQuery$data[]
  showDocumentsQuery?: ShowDocumentsQuery$data[]
  errors: FetchError[]
}

/**
 * Intial sync results data
 */
const syncResults: SyncResultsData = {
  artistsQuery: undefined,
  showsQuery: undefined,
  artistTabsQuery: [],
  artistArtworksQuery: [],
  artworkContentQuery: [],
  artistShowsQuery: [],
  showTabsQuery: [],
  artistDocumentsQuery: [],
  partnerShowTabsQuery: [],
  showArtworksQuery: [],
  showInstallsQuery: [],
  showDocumentsQuery: [],
  errors: [],
}

// Safe timeout for fetches, so that the PromisePool doesn't clog
const POOL_TIMEOUT = 10000

interface SyncManagerOptions {
  onComplete: () => void
  onProgress: (currentProgress: string | number) => void
  onStart: () => void
  onStatusChange: (message: string) => void
  partnerID: string
  relayEnvironment: RelayModernEnvironment
}

export function initSyncManager({
  onComplete,
  onStart,
  onProgress,
  onStatusChange,
  partnerID,
  relayEnvironment,
}: SyncManagerOptions) {
  if (!partnerID) {
    throw new Error("[sync] Error initializing sync: `partnerID` is required")
  }

  // Flag for when we enter retry loop. When retrying, don't log status updates.
  let isRetryingFromFailed = false

  const { fetchOrCatch } = initFetchOrCatch({
    relayEnvironment,
    onError: (error) => {
      syncResults.errors.push(error)
    },
  })

  const updateStatus = (...messages: any[]) => {
    log(...messages)

    if (!isRetryingFromFailed) {
      onStatusChange(messages[0])
    }
  }

  // Noticed that sometimes the `Error.captureStackTrace` is not available when
  // running on the device. This is a workaround to make sure it's available and
  // so that the app doesn't crash if encountering errors during sync.
  if (!("captureStackTrace" in Error)) {
    ;(Error as any).captureStackTrace = log
  }

  const startSync = async () => {
    updateStatus("Starting sync")
    onStart()

    /**
     * Add all queries to be synced here
     */
    const syncTargets = [
      syncArtistsQuery,
      syncShowsQuery,

      // Sub-queries. Order matters
      syncArtistTabsQuery,
      syncArtistArtworksQuery,
      syncArtworkContentQuery,
      syncArtistShowsQuery,
      syncArtistDocumentsQuery,
      syncShowTabsQuery,
      syncPartnerShowTabsQuery,
      syncShowArtworksQuery,
      syncShowInstallsQuery,
      syncShowDocumentsQuery,

      // Retry errors caught above 3 times
      retrySyncForErrors,

      // Media sync. We collect all urls from the queries above and sync the
      // images, install shots, and documents last.
      syncInstallShots,
      syncDocuments,
      syncImages,
    ]

    // Since some items depend on the next, fetch the above sequentially.
    // Internally, for things like artist images, we fetch in parallel.
    for (const [index, fetchSyncTargetData] of syncTargets.entries()) {
      try {
        onProgress(`${index}/${syncTargets.length}`)

        await fetchSyncTargetData()
      } catch (error) {
        updateStatus(`Error while performing sync: ${error}`)
      }
    }

    // Store the data in the cache. Later, if the user is offline they'll be
    // able to read from this store.
    saveRelayDataToOfflineCache(relayEnvironment)

    onComplete()

    log("* Sync complete. *")
  }

  /**
   * Top-level tabs
   */

  const syncArtistsQuery = async () => {
    updateStatus("Syncing artists")

    syncResults.artistsQuery = await fetchOrCatch<ArtistsQuery>(artistsQuery, {
      partnerID,
    })

    updateStatus("Complete. `artistsQuery`", syncResults.artistsQuery)
  }

  const syncShowsQuery = async () => {
    updateStatus("Syncing shows")

    syncResults.showsQuery = await fetchOrCatch<ShowsQuery>(showsQuery, {
      partnerID,
      imageSize,
    })

    updateStatus("Complete. `showsTabQuery`", syncResults.showsQuery)
  }

  /**
   * Sub-queries
   */

  const syncArtistTabsQuery = async () => {
    const artistSlugs = parsers.getArtistSlugs()

    // PromisePool is used to limit concurrency so we don't accidentally spam
    // our servers. By default it's 10 but can be adjusted.
    const { results } = await PromisePool.for(artistSlugs)
      .onTaskStarted(reportProgress("Syncing artist tabs"))
      .process(async (_) => {
        return await fetchOrCatch<ArtistTabsQuery>(artistTabsQuery, {
          partnerID,
          artworkIDs: [],
          imageSize,
        })
      })

    syncResults.artistTabsQuery = results

    updateStatus("Complete. `artistTabsQuery`", syncResults.artistTabsQuery)
  }

  const syncArtistArtworksQuery = async () => {
    const artistSlugs = parsers.getArtistSlugs()

    const { results } = await PromisePool.for(artistSlugs)
      .onTaskStarted(reportProgress("Syncing artist artworks"))
      .process(async (slug) => {
        return await fetchOrCatch<ArtistArtworksQuery>(artistArtworksQuery, {
          partnerID,
          slug,
          imageSize,
        })
      })

    syncResults.artistArtworksQuery = results

    updateStatus("Complete. `artistArtworksQuery`", syncResults.artistArtworksQuery)
  }

  const syncArtworkContentQuery = async () => {
    const artworkSlugs = parsers.getArtistArtworkSlugs()

    const { results } = await PromisePool.for(artworkSlugs)
      .onTaskStarted(reportProgress("Syncing artist artwork content"))
      .withConcurrency(20)
      .process(async (slug) => {
        return await fetchOrCatch<ArtworkContentQuery>(artworkContentQuery, {
          slug,
          imageSize,
        })
      })

    syncResults.artworkContentQuery = results

    updateStatus("Complete. `artistArtworksContentData`", syncResults.artworkContentQuery)
  }

  const syncArtistShowsQuery = async () => {
    const artistSlugs = parsers.getArtistSlugs()

    const { results } = await PromisePool.for(artistSlugs)
      .onTaskStarted(reportProgress("Syncing artist shows"))
      .process(async (slug) => {
        return (await fetchOrCatch<ArtistShowsQuery>(artistShowsQuery, {
          partnerID,
          slug,
          imageSize,
        })) as ArtistShowsQuery$rawResponse
      })

    syncResults.artistShowsQuery = results

    updateStatus("Complete. `artistShowsQuery`", syncResults.artistShowsQuery)
  }

  const syncShowTabsQuery = async () => {
    const artistShowSlugs = parsers.getArtistShowSlugs()

    const { results } = await PromisePool.for(artistShowSlugs)
      .onTaskStarted(reportProgress("Syncing show tabs"))
      .process(async (slug) => {
        return await fetchOrCatch<ShowTabsQuery>(showTabsQuery, { slug })
      })

    syncResults.showTabsQuery = results

    updateStatus("Complete. `showTabsQuery`", syncResults.showTabsQuery)
  }

  const syncArtistDocumentsQuery = async () => {
    const artistSlugs = parsers.getArtistSlugs()

    const { results } = await PromisePool.for(artistSlugs)
      .onTaskStarted(reportProgress("Syncing artist documents"))
      .process(async (slug) => {
        return await fetchOrCatch<ArtistDocumentsQuery>(artistDocumentsQuery, {
          partnerID,
          slug,
        })
      })

    syncResults.artistDocumentsQuery = results

    updateStatus("Complete. `artistDocumentsQuery`", syncResults.artistDocumentsQuery)
  }

  const syncPartnerShowTabsQuery = async () => {
    const showSlugs = parsers.getShowSlugs()

    const { results } = await PromisePool.for(showSlugs)
      .onTaskStarted(reportProgress("Syncing partner shows"))
      .process(async (slug) => {
        return await fetchOrCatch<ShowTabsQuery>(showTabsQuery, { slug })
      })

    syncResults.partnerShowTabsQuery = results

    updateStatus("Complete. `partnerShowTabsQuery`", syncResults.partnerShowTabsQuery)
  }

  const syncShowArtworksQuery = async () => {
    const showSlugs = parsers.getShowSlugs()

    const { results } = await PromisePool.for(showSlugs)
      .onTaskStarted(reportProgress("Syncing show artworks"))
      .process(async (slug) => {
        return await fetchOrCatch<ShowArtworksQuery>(showArtworksQuery, { slug, imageSize })
      })

    syncResults.showArtworksQuery = results

    updateStatus("Complete. `showArtworksQuery`", syncResults.showArtworksQuery)
  }

  const syncShowInstallsQuery = async () => {
    const showSlugs = parsers.getShowSlugs()

    const { results } = await PromisePool.for(showSlugs)
      .onTaskStarted(reportProgress("Syncing show installs"))
      .process(async (slug) => {
        return await fetchOrCatch<ShowInstallsQuery>(showInstallsQuery, { slug, imageSize })
      })

    syncResults.showInstallsQuery = results

    updateStatus("Complete. `showInstallsQuery`", syncResults.showInstallsQuery)
  }

  const syncShowDocumentsQuery = async () => {
    const showSlugs = parsers.getShowSlugs()

    const { results } = await PromisePool.for(showSlugs)
      .onTaskStarted(reportProgress("Syncing show documents"))
      .process(async (slug) => {
        return fetchOrCatch<ShowDocumentsQuery>(showDocumentsQuery, { slug, partnerID })
      })

    syncResults.showDocumentsQuery = results

    updateStatus("Complete. `showDocumentsQuery`", syncResults.showDocumentsQuery)
  }

  /**
   * Media sync, such as images, install shots, and documents
   */

  const syncImages = async () => {
    const urls = parsers.getImageUrls()

    await PromisePool.for(urls)
      .onTaskStarted(reportProgress("Syncing images"))
      .withConcurrency(20)
      .withTaskTimeout(POOL_TIMEOUT)
      .process(async (url) => {
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
      .withConcurrency(20)
      .withTaskTimeout(POOL_TIMEOUT)
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
      .withConcurrency(20)
      .withTaskTimeout(POOL_TIMEOUT)
      .process(async (url) => {
        return await downloadFileToCache({
          type: "document",
          url,
          accessToken,
        })
      })
  }

  const retrySyncForErrors = async () => {
    if (syncResults.errors.length === 0) {
      return
    }

    updateStatus("Validating sync")

    isRetryingFromFailed = true

    const MAX_RETRY_ATTEMPTS = 2

    let retryAttempt = 0

    const retry = async () => {
      const errors = uniqBy(
        syncResults.errors.map(({ error, ...rest }) => {
          const QueryName = (error.req as RelayNetworkLayerRequest).id

          return {
            QueryName,
            error,
            ...rest,
          }
        }),
        "QueryName"
      )

      // Reset errors for new fetch requests
      syncResults.errors = []

      await PromisePool.for(errors).process(async ({ QueryName }) => {
        try {
          // Dynamically invoke sync functions based on the `syncSomeQuery`
          // function naming idiom defined above (eg, `syncArtistShowsQuery()`)
          await eval(`sync${QueryName}()`)
        } catch (error) {
          log("Error retrying sync", error)
        }
      })

      // After the requests above execute, check if there are any new errors
      // that have been populated and if so, retry again
      const shouldRetry = syncResults.errors.length > 0

      if (shouldRetry) {
        if (retryAttempt < MAX_RETRY_ATTEMPTS) {
          retryAttempt++

          await retry()
        }
      }
    }

    // Start retry loop
    await retry()

    isRetryingFromFailed = false
  }

  const reportProgress = (message: string) => {
    const onProgressCallback: OnProgressCallback<string> = (_, pool) => {
      if (!isRetryingFromFailed) {
        onStatusChange(`${message}: ${Math.floor(pool.processedPercentage())}%`)
      }
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
    const artists = extractNodes(syncResults.artistsQuery?.partner?.allArtistsConnection)

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
    const imageUrls = compact(
      (syncResults.artworkContentQuery ?? []).flatMap((artworkContent) => [
        artworkContent.artwork?.image?.resized?.url!,
        artworkContent.artwork?.artist?.imageUrl!,
      ])
    )

    return imageUrls
  },

  getInstallShotUrls: (): string[] => {
    const installShotUrls = compact(
      (syncResults.artistShowsQuery ?? [])
        .flatMap((artistShows) => extractNodes(artistShows.partner?.showsConnection))
        .map((show) => show.coverImage?.resized?.url!)
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
