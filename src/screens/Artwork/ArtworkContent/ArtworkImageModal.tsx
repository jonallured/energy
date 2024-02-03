import {
  BackButton,
  DEFAULT_HIT_SLOP,
  Flex,
  ZINDEX,
  useColor,
} from "@artsy/palette-mobile"
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view"
import { ArtworkContent_artwork$data } from "__generated__/ArtworkContent_artwork.graphql"
import { Modal } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { CachedImage } from "system/wrappers/CachedImage"
import { useIsDarkMode } from "utils/hooks/useIsDarkMode"

const SCREEN_TOP_MARGIN = 85

interface ArtworkImageModalProps {
  onClose: () => void
  image?: ArtworkContent_artwork$data["image"]
  // Toggle this to true when the modal is used outside of the artwork view
  isStandAlone?: boolean
  uri?: string
}

export const ArtworkImageModal: React.FC<ArtworkImageModalProps> = ({
  onClose,
  image,
  isStandAlone = false,
  uri,
}) => {
  const isDarkMode = useIsDarkMode()
  const insets = useSafeAreaInsets()
  const color = useColor()

  const imageProps = image
    ? {
        uri: image?.resized?.url,
        width: image.resized?.width as number,
        height: image.resized?.height as number,
        aspectRatio: image.aspectRatio,
      }
    : {
        uri,
      }

  // If we're in an artwork view, we need to account for the bottom sheet and
  // center within the remaining area of the screeen. Elsewhere, we can be exact
  const offset = isStandAlone ? 0 : (`${-SCREEN_TOP_MARGIN}px` as any)
  const backgroundColor = color(isDarkMode ? "black100" : "white100")

  return (
    <Modal
      onRequestClose={onClose}
      animationType="fade"
      presentationStyle="fullScreen"
      supportedOrientations={["portrait", "landscape"]}
    >
      <Flex
        position="absolute"
        width="100%"
        height="100%"
        pointerEvents="none"
        backgroundColor={backgroundColor}
      />

      <Flex position="absolute" top={insets.top} px={2} py={2} zIndex={3}>
        <BackButton showX onPress={onClose} hitSlop={DEFAULT_HIT_SLOP} />
      </Flex>

      <ReactNativeZoomableView
        maxZoom={3}
        onDoubleTapAfter={onClose}
        style={{
          backgroundColor,
          ZINDEX: 100,
        }}
      >
        <Flex mt={offset} flex={1}>
          <CachedImage
            {...imageProps}
            width="100%"
            resizeMode="contain"
            fadeInOnLoad={false}
            backgroundColor="transparent"
            style={{
              zIndex: ZINDEX.artworkContent,
              flex: 1,
            }}
          />
        </Flex>
      </ReactNativeZoomableView>
    </Modal>
  )
}
