import { BackButton, DEFAULT_HIT_SLOP, Flex } from "@artsy/palette-mobile"
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view"
import { ArtworkImageModalQuery } from "__generated__/ArtworkImageModalQuery.graphql"
import { Modal } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql } from "react-relay"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { CachedImage } from "system/wrappers/CachedImage"
import { imageSize } from "utils/imageSize"

interface ArtworkImageModalProps {
  isModalVisible: boolean
  setIsModalVisible: (x: boolean) => void
  slug?: string
  uri?: string
}

export const ArtworkImageModalQueryRenderer: React.FC<ArtworkImageModalProps> = ({
  slug,
  ...props
}) => {
  const data = useSystemQueryLoader<ArtworkImageModalQuery>(artworkImageModalQuery, {
    slug: slug as string,
    imageSize,
  })

  return <ArtworkImageModal {...props} uri={data?.artwork?.image?.resized?.url} />
}

export const ArtworkImageModal: React.FC<ArtworkImageModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  uri,
}) => {
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
      <Flex backgroundColor="background" flex={1} pt={`${insets.top}px`}>
        <ReactNativeZoomableView maxZoom={2}>
          <CachedImage
            uri={uri}
            style={{ flex: 1, backgroundColor: "transparent" }}
            width="100%"
            height="100%"
            resizeMode="contain"
            fadeInOnLoad={true}
          />
        </ReactNativeZoomableView>

        <Flex position="absolute" pt={`${insets.top + 8}px`} left={-8} px={2}>
          <BackButton showX onPress={() => setIsModalVisible(false)} hitSlop={DEFAULT_HIT_SLOP} />
        </Flex>
      </Flex>
    </Modal>
  )
}

export const artworkImageModalQuery = graphql`
  query ArtworkImageModalQuery($slug: String!, $imageSize: Int!) {
    artwork(id: $slug) {
      image {
        resized(width: $imageSize, version: "normalized") {
          url
          width
          height
        }
      }
    }
  }
`
