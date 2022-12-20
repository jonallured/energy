import { BackButton, Flex } from "@artsy/palette-mobile"
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view"
import { Modal } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { CachedImage } from "app/system/wrappers/CachedImage"

interface ImageModalProps {
  isModalVisible: boolean
  setIsModalVisible: (x: boolean) => void
  uri: string
}

export const ImageModal = ({ isModalVisible, setIsModalVisible, uri }: ImageModalProps) => {
  const insets = useSafeAreaInsets()

  return (
    <Modal
      visible={isModalVisible}
      onRequestClose={() => {
        setIsModalVisible(false)
      }}
      animationType="fade"
      presentationStyle="fullScreen"
    >
      <Flex backgroundColor="background" flex={1} pt={insets.top}>
        <ReactNativeZoomableView maxZoom={2}>
          <CachedImage
            uri={uri}
            style={{ flex: 1, width: "100%" }}
            resizeMode="contain"
            placeholderHeight={undefined}
          />
        </ReactNativeZoomableView>
        <Flex position="absolute" pt={insets.top} px={2}>
          <BackButton showX onPress={() => setIsModalVisible(false)} />
        </Flex>
      </Flex>
    </Modal>
  )
}
