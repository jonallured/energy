import { Button, Spacer, Flex } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { NativeModules } from "react-native"
import { ARTNativeModules } from "app/native_modules/ARTNativeModules"
import { GlobalStore } from "app/system/store/GlobalStore"
import { Screen } from "palette"

export const DevMenu = () => {
  const navigation = useNavigation()
  const currentEnvironment = GlobalStore.useAppState((s) => s.config.environment.activeEnvironment)

  return (
    <Screen>
      <Screen.Background>
        <Flex backgroundColor="devpurple" flex={1} />
      </Screen.Background>
      <Screen.Body>
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
        <Spacer y={1} />
        {/* eslint-disable-next-line */}
        <Button block onPress={() => NativeModules.DevMenu.show()}>
          Show native dev menu
        </Button>
        <Spacer y={1} />
        <Button block onPress={() => void ARTNativeModules.ARTAlbumMigrationModule.addTestAlbums()}>
          Add native test albums
        </Button>
        <Spacer y={1} />
        <Button
          block
          onPress={() => void ARTNativeModules.ARTAlbumMigrationModule.resetAlbumReadAttempts()}
        >
          Reset Album Read Attempts
        </Button>
        <Spacer y={1} />
        <Button
          block
          onPress={() => {
            const albums = ARTNativeModules.ARTAlbumMigrationModule.readAlbums()
            if (albums) {
              albums.forEach((nativeAlbum) => {
                const album = {
                  name: nativeAlbum.name,
                  artworkIds: nativeAlbum.artworkIDs,
                  installShotUrls: [],
                  documentIds: [],
                }
                console.log("Got album name", album.name)
                console.log("Got album artworkIDs", album.artworkIds)
                console.log("Got album artworkIDs", album)
                GlobalStore.actions.albums.addAlbum(album)
              })
            }
          }}
        >
          Read albums
        </Button>
      </Screen.Body>
    </Screen>
  )
}
