import { PromisePool } from "@supercharge/promise-pool"
import { ArtworkQuery } from "__generated__/ArtworkQuery.graphql"
import { ARTNativeModules } from "native_modules/ARTNativeModules"
import { fetchQuery } from "react-relay"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { artworkQuery } from "screens/Artwork/Artwork"
import { GlobalStore } from "system/store/GlobalStore"
import { SelectedItemArtwork } from "system/store/Models/SelectModeModel"

const MAX_QUERY_CONCURRENCY = 5
const MAX_RETRY_COUNT = 3

export async function attemptAlbumMigration(
  relayEnvironment: RelayModernEnvironment
) {
  const albums = ARTNativeModules.ARTAlbumMigrationModule.readAlbums()
  if (albums) {
    for (const nativeAlbum of albums) {
      const artworkSlugs = nativeAlbum.artworkIDs

      const { results: artworks } = await PromisePool.withConcurrency(
        MAX_QUERY_CONCURRENCY
      )
        .for(artworkSlugs)
        .process(async (slug) => {
          for (let attempt = 1; attempt <= MAX_RETRY_COUNT; attempt++) {
            try {
              const artworkData = await fetchQuery<ArtworkQuery>(
                relayEnvironment,
                artworkQuery,
                {
                  slug,
                }
              ).toPromise()
              if (artworkData?.artwork) {
                return {
                  ...(artworkData.artwork as unknown as SelectedItemArtwork),
                  slug,
                } as SelectedItemArtwork
              }
            } catch (error) {
              console.error(
                `Attempt ${attempt}: Failed to fetch artwork data for slug: ${slug}`,
                error
              )
              if (attempt === MAX_RETRY_COUNT) {
                return null
              }
            }
          }
        })

      const compactArtworks = artworks.filter(
        (artwork) => artwork !== null && artwork !== undefined
      )

      const album = {
        name: nativeAlbum.name,
        items: compactArtworks as SelectedItemArtwork[],
      }

      GlobalStore.actions.albums.addAlbum(album)
    }
  }
}
