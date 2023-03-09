import { Button, Spacer, Join } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import * as Sentry from "@sentry/react-native"
import { ARTNativeModules } from "native_modules/ARTNativeModules"
import { NativeModules } from "react-native"
import { GlobalStore } from "system/store/GlobalStore"
import { SelectedItemArtwork } from "system/store/Models/SelectModeModel"

export const DevMenu = () => {
  const navigation = useNavigation()
  const currentEnvironment = GlobalStore.useAppState((s) => s.config.environment.activeEnvironment)

  return (
    <Join separator={<Spacer y={1} />}>
      <Button
        block
        onPress={() => {
          GlobalStore.actions.config.environment.setEnvironment(
            currentEnvironment === "staging" ? "production" : "staging"
          )
          GlobalStore.actions.auth.signOut()
          navigation.goBack()
        }}
      >
        Switch to {currentEnvironment == "staging" ? "production" : "staging"}
      </Button>
      {/* eslint-disable-next-line */}
      <Button block onPress={() => NativeModules.DevMenu.show()}>
        Show native dev menu
      </Button>
      <Button block onPress={() => ARTNativeModules.ARTAlbumMigrationModule.addTestAlbums()}>
        Add native test albums
      </Button>
      <Button
        block
        onPress={() => ARTNativeModules.ARTAlbumMigrationModule.resetAlbumReadAttempts()}
      >
        Reset Album Read Attempts
      </Button>
      <Button
        block
        onPress={() => {
          const albums = ARTNativeModules.ARTAlbumMigrationModule.readAlbums()
          if (albums) {
            albums.forEach((nativeAlbum) => {
              const album = {
                name: nativeAlbum.name,
                items: nativeAlbum.artworkIDs.map((internalID) => ({
                  __typename: "Artwork",
                  internalID,
                  slug: internalID,
                })) as SelectedItemArtwork[],
              }
              console.log("Got album name", album.name)
              console.log("Got album items", album.items)
              console.log("Got album", album)

              GlobalStore.actions.albums.addAlbum(album)
            })
          }
        }}
      >
        Read albums
      </Button>
      <Button
        block
        onPress={() => {
          Sentry.nativeCrash()
        }}
      >
        Trigger Sentry native crash
      </Button>
      <Button
        block
        onPress={() => {
          throw Error("Sentry test error")
        }}
      >
        Trigger Sentry thrown error
      </Button>
    </Join>
  )
}
