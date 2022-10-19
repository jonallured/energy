import { ARTNativeModules } from "app/native_modules/ARTNativeModules"
import { GlobalStore } from "app/store/GlobalStore"

export function attemptAlbumMigration() {
  const accesstoken = GlobalStore.useAppState((store) => store.auth.userAccessToken)
  const isLoggedIn = !!accesstoken

  if (!isLoggedIn) {
    return
  }

  const albums = ARTNativeModules.ARTAlbumMigrationModule.readAlbums()
  if (albums) {
    albums.forEach((nativeAlbum) => {
      // slight delta from native format and typescript
      const album = {
        name: nativeAlbum.name,
        artworkIds: nativeAlbum.artworkIDs,
      }
      GlobalStore.actions.albums.addAlbum(album)
    })
  }
}
