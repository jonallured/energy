import { Button, Spacer, Flex } from "@artsy/palette-mobile"
import { useState, useEffect } from "react"
import { Modal, NativeModules } from "react-native"
import RNShake from "react-native-shake"
import { ARTNativeModules } from "app/native_modules/ARTNativeModules"
import { GlobalStore } from "app/store/GlobalStore"

export const DevMenu = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const currentEnvironment = GlobalStore.useAppState((s) => s.config.environment.activeEnvironment)

  useEffect(() => {
    if (__DEV__) {
      // eslint-disable-next-line
      NativeModules.DevSettings.setIsShakeToShowDevMenuEnabled(false)
    }
  }, [])

  useEffect(() => {
    const subscription = RNShake.addListener(() => {
      setModalVisible((x) => !x)
    })

    return () => subscription.remove()
  }, [])

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false)
      }}
      presentationStyle="pageSheet"
    >
      <Flex backgroundColor="purple" flex={1} pt={6} px={2}>
        <Button
          block
          onPress={() => {
            GlobalStore.actions.config.environment.setEnvironment(
              currentEnvironment === "staging" ? "production" : "staging"
            )
            GlobalStore.actions.auth.signOut()
            setModalVisible((x) => !x)
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
      </Flex>
    </Modal>
  )
}
