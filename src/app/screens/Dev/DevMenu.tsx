import { Spacer } from "@artsy/palette-mobile"
import { useState } from "react"
import { useEffect } from "react"
import { Modal, NativeModules } from "react-native"
import RNShake from "react-native-shake"
import { GlobalStore } from "app/store/GlobalStore"
import { Flex } from "palette"
import { Button } from "palette"
import { ARTNativeModules } from "app/native_modules/ARTNativeModules"

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
      <Flex background="purple" flex={1} pt={6} px={2}>
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
        <Spacer m={1} />
        {/* eslint-disable-next-line */}
        <Button block onPress={() => NativeModules.DevMenu.show()}>
          Show native dev menu
        </Button>
        <Spacer m={1} />
        <Button block onPress={() => {
          ARTNativeModules.ARTAlbumMigrationModule.addTestAlbums()
        }}>
          Add native test albums
        </Button>
        <Spacer m={1} />
        <Button block onPress={() => {
          const albums = ARTNativeModules.ARTAlbumMigrationModule.readAlbums()
          if (albums) {
            albums.forEach((nativeAlbum) => {
              const album = {
                name: nativeAlbum.name,
                artworkIds: nativeAlbum.artworkIDs
              }
              console.log('Got album name', album.name)
              console.log('Got album artworkIDs', album.artworkIds)
              GlobalStore.actions.albums.addAlbum(album)
            })
          }
        }}>
          Read albums
        </Button>
      </Flex>
    </Modal>
  )
}
