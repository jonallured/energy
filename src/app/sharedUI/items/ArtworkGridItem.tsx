import { graphql, useFragment } from "react-relay"
import { CheckCircleFillIcon, Flex, Text, Touchable, TrashIcon } from "palette"
import { Image } from "react-native"
import { ArtworkGridItem_artwork$key } from "__generated__/ArtworkGridItem_artwork.graphql"

interface ArtworkGridItemProps {
  artwork: ArtworkGridItem_artwork$key
  onPress?: () => void
  selectedToAdd?: boolean
  selectedToRemove?: boolean
  disable?: boolean
}

export const ArtworkGridItem: React.FC<ArtworkGridItemProps> = (props) => {
  const artwork = useFragment<ArtworkGridItem_artwork$key>(ArtworkGridItemFragment, props.artwork)

  const { disable, selectedToAdd, selectedToRemove, onPress } = props

  return (
    <Touchable disabled={disable} onPress={onPress}>
      <Flex mb={4} pl={2} opacity={disable || selectedToAdd || selectedToRemove ? 0.4 : 1}>
        <Image
          source={{ uri: Image.resolveAssetSource({ uri: artwork.image?.url! }).uri }}
          style={{
            aspectRatio: artwork.image?.aspectRatio ?? 1,
          }}
        />
        <Text italic variant="xs" color="black60" mt={1}>
          {artwork.title},{" "}
          <Text variant="xs" color="black60">
            {artwork.date}
          </Text>
        </Text>
      </Flex>
      {!disable && selectedToAdd ? (
        <Flex position="absolute" top={1} right={1} alignItems="center" justifyContent="center">
          <CheckCircleFillIcon height={30} width={30} fill="blue100" />
        </Flex>
      ) : null}
      {selectedToRemove ? (
        <Flex
          position="absolute"
          top={1}
          right={1}
          alignItems="center"
          p={0.5}
          borderRadius={50}
          justifyContent="center"
          backgroundColor="red100"
        >
          <TrashIcon height={20} width={20} fill="white100" />
        </Flex>
      ) : null}
    </Touchable>
  )
}

const ArtworkGridItemFragment = graphql`
  fragment ArtworkGridItem_artwork on Artwork {
    internalID
    title
    date
    image {
      url
      aspectRatio
    }
  }
`
