import { CheckCircleFillIcon, Flex, Touchable } from "@artsy/palette-mobile"
import { useState } from "react"
import { Image } from "react-native"
import { ImageModal } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"

interface ArtworkImageGridItemProps {
  url: string
  onPress?: () => void
  selectedToAdd?: boolean
}

export const ArtworkImageGridItem = ({
  url,
  onPress,
  selectedToAdd,
}: ArtworkImageGridItemProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const isSelectModeActive = GlobalStore.useAppState((state) => state.selectMode.isActive)

  return (
    <Flex mb={4} pl={2} testID={url}>
      <ImageModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} uri={url} />
      <Touchable
        style={{ width: "100%", height: "100%" }}
        onPress={isSelectModeActive ? onPress : () => setIsModalVisible(!isModalVisible)}
      >
        <Flex opacity={selectedToAdd ? 0.4 : 1}>
          <Image source={{ uri: url }} style={{ aspectRatio: 1 }} />
        </Flex>
        {selectedToAdd && (
          <Flex position="absolute" top={1} right={1} alignItems="center" justifyContent="center">
            <CheckCircleFillIcon height={30} width={30} fill="blue100" />
          </Flex>
        )}
      </Touchable>
    </Flex>
  )
}
