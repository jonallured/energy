import { ARTNativeModules } from "native_modules/ARTNativeModules"
import { GlobalStore } from "system/store/GlobalStore"
import { SelectedItemArtwork } from "system/store/Models/SelectModeModel"

export function attemptAlbumMigration() {
  const albums = ARTNativeModules.ARTAlbumMigrationModule.readAlbums()
  if (albums) {
    albums.forEach((nativeAlbum) => {
      // slight delta from native format and typescript
      const album = {
        name: nativeAlbum.name,
        items: nativeAlbum.artworkIDs.map(
          (slug) =>
            ({
              __typename: "Artwork",
              slug,
              internalID: slug,
            } as SelectedItemArtwork)
        ),
      }
      GlobalStore.actions.albums.addAlbum(album)
    })
  }
}
