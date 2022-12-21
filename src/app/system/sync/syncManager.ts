import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
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
import { artworkContentQuery } from "app/screens/Artwork/ArtworkContent/ArtworkContent"
import { artistArtworksQuery } from "app/screens/HomeTabs/Artists/ArtistTabs/ArtistArtworks/ArtistArtworks"
import { artistDocumentsQuery } from "app/screens/HomeTabs/Artists/ArtistTabs/ArtistDocuments/ArtistDocuments"
import { artistShowsQuery } from "app/screens/HomeTabs/Artists/ArtistTabs/ArtistShows/ArtistShows"
import { artistTabsQuery } from "app/screens/HomeTabs/Artists/ArtistTabs/ArtistTabs"
import { artistsQuery } from "app/screens/HomeTabs/Artists/Artists"
import { showArtworksQuery } from "app/screens/HomeTabs/Shows/ShowTabs/ShowArtworks/ShowArtworks"
import { showDocumentsQuery } from "app/screens/HomeTabs/Shows/ShowTabs/ShowDocuments/ShowDocuments"
import { showInstallsQuery } from "app/screens/HomeTabs/Shows/ShowTabs/ShowInstalls/ShowInstalls"
import { showTabsQuery } from "app/screens/HomeTabs/Shows/ShowTabs/ShowTabs"
import { showsQuery } from "app/screens/HomeTabs/Shows/Shows"
import { RelayContextProps } from "app/system/relay/RelayProvider"
import { extractNodes } from "app/utils"
import { imageSize } from "app/utils/imageSize"
import { getFileFromCache, saveFileToCache, downloadFileToCache } from "./fileCache"
import { forEachAsync, mapAsync } from "./utils/asyncIterators"
import { initFetchOrCatch } from "./utils/fetchOrCatch"

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
}

interface SyncManagerOptions {
  onComplete: () => void
  onProgress: (currentProgress: number) => void
  onStatusChange: (message: string) => void
  partnerID: string
  relayEnvironment: RelayModernEnvironment
}

export function initSyncManager({
  onComplete,
  onProgress,
  onStatusChange,
  partnerID,
  relayEnvironment,
}: SyncManagerOptions) {
  if (!partnerID) {
    throw new Error("[sync] Error initializing sync: `partnerID` is required")
  }

  const { fetchOrCatch } = initFetchOrCatch(relayEnvironment)

  const updateStatus = (...messages: any[]) => {
    log(...messages)
    onStatusChange(messages[0])
  }

  const startSync = async () => {
    updateStatus("Starting sync...")

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

      // Media sync. We collect all urls from the queries above and sync the
      // images, install shots, and documents last.
      syncImages,
      syncInstallShots,
      syncDocuments,
    ]

    // Since some items depend on the next, fetch the above sequentially.
    // Internally, for things like artist images, we fetch in parallel.
    for (const [index, fetchSyncTargetData] of syncTargets.entries()) {
      try {
        onProgress(index / (syncTargets.length - 1))

        await fetchSyncTargetData()
      } catch (error) {
        updateStatus(`Error while performing sync: ${error}`)
      }
    }

    // Store the data in the cache. Later, if the user is offline they'll be
    // able to read from this store.
    persistDataToOfflineCache(relayEnvironment)

    onComplete()

    log("* Sync complete. *")
  }

  /**
   * Top-level tabs
   */

  const syncArtistsQuery = async () => {
    updateStatus("Syncing artists...")

    syncResults.artistsQuery = await fetchOrCatch<ArtistsQuery>(artistsQuery, {
      partnerID,
    })

    updateStatus("Complete. `artistsQuery`", syncResults.artistsQuery)
  }

  const syncShowsQuery = async () => {
    updateStatus("Syncing shows...")

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
    updateStatus("Syncing artistTabs...")

    const artistSlugs = parsers.getArtistSlugs()

    syncResults.artistTabsQuery = await mapAsync(artistSlugs, (_) => {
      return fetchOrCatch<ArtistTabsQuery>(artistTabsQuery, {
        partnerID,
        artworkIDs: [],
        imageSize,
      })
    })

    updateStatus("Complete. `artistTabsQuery`", syncResults.artistTabsQuery)
  }

  const syncArtistArtworksQuery = async () => {
    updateStatus("Syncing artist artworks...")

    const artistSlugs = parsers.getArtistSlugs()

    syncResults.artistArtworksQuery = await mapAsync(artistSlugs, (slug) => {
      return fetchOrCatch<ArtistArtworksQuery>(artistArtworksQuery, {
        partnerID,
        slug,
        imageSize,
      })
    })

    updateStatus("Complete. `artistArtworksQuery`", syncResults.artistArtworksQuery)
  }

  const syncArtworkContentQuery = async () => {
    updateStatus("Syncing artist artwork content...")

    const artworkSlugs = parsers.getArtistArtworkSlugs()

    syncResults.artworkContentQuery = await mapAsync(artworkSlugs, (slug) => {
      return fetchOrCatch<ArtworkContentQuery>(artworkContentQuery, {
        slug,
        imageSize,
      })
    })

    updateStatus("Complete. `artistArtworksContentData`", syncResults.artworkContentQuery)
  }

  const syncArtistShowsQuery = async () => {
    updateStatus("Syncing artist shows...")

    const artistSlugs = parsers.getArtistSlugs()

    syncResults.artistShowsQuery = await mapAsync(artistSlugs, (slug) => {
      return fetchOrCatch<ArtistShowsQuery>(artistShowsQuery, {
        partnerID,
        slug,
        imageSize,
      })
    })

    updateStatus("Complete. `artistShowsQuery`", syncResults.artistShowsQuery)
  }

  const syncShowTabsQuery = async () => {
    updateStatus("Syncing show tabs...")

    const artistShowSlugs = parsers.getArtistShowSlugs()

    syncResults.showTabsQuery = await mapAsync(artistShowSlugs, (slug) => {
      return fetchOrCatch<ShowTabsQuery>(showTabsQuery, { slug })
    })

    updateStatus("Complete. `showTabsQuery`", syncResults.showTabsQuery)
  }

  const syncArtistDocumentsQuery = async () => {
    updateStatus("Syncing artist documents...")

    const artistSlugs = parsers.getArtistSlugs()

    syncResults.artistDocumentsQuery = await mapAsync(artistSlugs, (slug) => {
      return fetchOrCatch<ArtistDocumentsQuery>(artistDocumentsQuery, {
        partnerID,
        slug,
      })
    })

    updateStatus("Complete. `artistDocumentsQuery`", syncResults.artistDocumentsQuery)
  }

  const syncPartnerShowTabsQuery = async () => {
    updateStatus("Syncing partner shows...")

    const showSlugs = parsers.getShowSlugs()

    syncResults.partnerShowTabsQuery = await mapAsync(showSlugs, (slug) => {
      return fetchOrCatch<ShowTabsQuery>(showTabsQuery, { slug })
    })

    updateStatus("Complete. `partnerShowTabsQuery`", syncResults.partnerShowTabsQuery)
  }

  const syncShowArtworksQuery = async () => {
    updateStatus("Syncing show artworks...")

    const showSlugs = parsers.getShowSlugs()

    syncResults.showArtworksQuery = await mapAsync(showSlugs, (slug) => {
      return fetchOrCatch<ShowArtworksQuery>(showArtworksQuery, { slug, imageSize })
    })

    updateStatus("Complete. `showArtworksQuery`", syncResults.showArtworksQuery)
  }

  const syncShowInstallsQuery = async () => {
    updateStatus("Syncing show installs...")

    const showSlugs = parsers.getShowSlugs()

    syncResults.showInstallsQuery = await mapAsync(showSlugs, (slug) => {
      return fetchOrCatch<ShowInstallsQuery>(showInstallsQuery, { slug, imageSize })
    })

    updateStatus("Complete. `showInstallsQuery`", syncResults.showInstallsQuery)
  }

  const syncShowDocumentsQuery = async () => {
    updateStatus("Syncing show documents...")

    const showSlugs = parsers.getShowSlugs()

    syncResults.showDocumentsQuery = await mapAsync(showSlugs, (slug) => {
      return fetchOrCatch<ShowDocumentsQuery>(showDocumentsQuery, { slug, partnerID })
    })

    updateStatus("Complete. `showDocumentsQuery`", syncResults.showDocumentsQuery)
  }

  /**
   * Media sync, such as images, install shots, and documents
   */

  const syncImages = async () => {
    updateStatus("Syncing images...")

    const urls = parsers.getImageUrls()

    await forEachAsync(urls, (url) =>
      downloadFileToCache({
        type: "image",
        url,
      })
    )
  }

  const syncInstallShots = async () => {
    updateStatus("Syncing install shots...")

    const urls = parsers.getInstallShotUrls()

    await forEachAsync(urls, (url) =>
      downloadFileToCache({
        type: "image",
        url,
      })
    )
  }

  const syncDocuments = async () => {
    updateStatus("Syncing documents...")

    const urls = parsers.getDocumentsUrls()

    await forEachAsync(urls, (url) =>
      downloadFileToCache({
        type: "document",
        url,
      })
    )
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

    const artistSlugs = artists.map((artist) => {
      return artist.slug
    })

    return artistSlugs
  },

  getArtistArtworkSlugs: (): string[] => {
    const artworks = syncResults.artistArtworksQuery?.flatMap((artistArtworks) => {
      return extractNodes(artistArtworks.partner?.artworksConnection)
    })

    if (!artworks) {
      return []
    }

    const artworkSlugs = artworks.map((artwork) => {
      return artwork.slug
    })

    return artworkSlugs
  },

  getArtistShowSlugs: (): string[] => {
    const shows = syncResults.artistShowsQuery?.flatMap((artistShows) => {
      return extractNodes(artistShows.partner?.showsConnection)
    })

    if (!shows) {
      return []
    }

    if (shows.length > 0) {
      log("Has shows", shows)
    }

    const showSlugs = shows.map((show) => {
      return show.slug
    })

    if (showSlugs.length > 0) {
      log("Has show slugs", showSlugs)
    }

    return showSlugs
  },

  getShowSlugs: (): string[] => {
    const shows = extractNodes(syncResults.showsQuery?.partner?.showsConnection)

    const showSlugs = shows.map((show) => {
      return show.slug
    })

    return showSlugs
  },

  getImageUrls: (): string[] => {
    const imageUrls = (syncResults.artworkContentQuery ?? [])
      .map((artworkContent) => artworkContent.artwork?.image?.resized?.url ?? "")
      .filter((url: string) => url !== "")

    return imageUrls
  },

  getInstallShotUrls: (): string[] => {
    const installShotUrls = (syncResults.artistShowsQuery ?? [])
      .flatMap((artistShows) => extractNodes(artistShows.partner?.showsConnection))
      .map((show) => show.coverImage?.resized?.url)
      .filter((url): url is string => url !== undefined)
      .filter((url) => url !== "")

    return installShotUrls
  },

  getDocumentsUrls: (): string[] => {
    const documentsUrls = (syncResults.artistDocumentsQuery ?? [])
      .flatMap((artistDocs) => extractNodes(artistDocs.partner?.documentsConnection))
      .map((doc) => doc.publicURL)
      .filter((url) => url !== "")

    return documentsUrls
  },
}

const log = (...messages: any[]) => console.log("\n[sync]:", ...messages)

/**
 * Create and save the Relay store to disk
 */

const persistDataToOfflineCache = async (relayEnvironment: RelayModernEnvironment) => {
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
  getFileFromCache({ filename: "relayData.json", type: "relayData" }).then((data) => {
    log("Loading relay data from cache.")

    resetRelayEnvironment(JSON.parse(data!))
  })
}
