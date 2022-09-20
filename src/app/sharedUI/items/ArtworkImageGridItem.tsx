import { useState } from "react"
import { Image } from "react-native"
import { ImageModal } from "app/sharedUI"
import { Flex, Touchable } from "palette"

interface ArtworkImageGridItemProps {
  url: string
}

export const ArtworkImageGridItem: React.FC<ArtworkImageGridItemProps> = ({ url }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  return (
    <Flex mb={4} pl={2} testID={url}>
      <ImageModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} uri={url} />
      <Touchable
        style={{ width: "100%", height: "100%" }}
        onPress={() => setIsModalVisible(!isModalVisible)}
      >
        <Image source={{ uri: url }} style={{ aspectRatio: 1 }} />
      </Touchable>
    </Flex>
  )
}
