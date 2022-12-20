import { ARTNativeModules } from "app/native_modules/ARTNativeModules"
import { GlobalStore } from "app/system/store/GlobalStore"

export function attemptAlbumMigration() {
  const albums = ARTNativeModules.ARTAlbumMigrationModule.readAlbums()
  if (albums) {
    albums.forEach((nativeAlbum) => {
      // slight delta from native format and typescript
      const album = {
        name: nativeAlbum.name,
        artworkIds: nativeAlbum.artworkIDs,
        documentIds: [],
        installShotUrls: [],
      }
      GlobalStore.actions.albums.addAlbum(album)
    })
  }
}
