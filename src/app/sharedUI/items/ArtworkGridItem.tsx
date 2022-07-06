import { graphql, useFragment } from "react-relay"
import { CheckCircleFillIcon, Flex, Text, Touchable } from "palette"
import { Image } from "react-native"
import { ArtworkGridItem_artwork$key } from "__generated__/ArtworkGridItem_artwork.graphql"

interface ArtworkGridItemProps {
  artwork: ArtworkGridItem_artwork$key
  onPress?: () => void
  selected?: boolean
}

export const ArtworkGridItem: React.FC<ArtworkGridItemProps> = (props) => {
  const artwork = useFragment<ArtworkGridItem_artwork$key>(ArtworkGridItemFragment, props.artwork)

  return (
    <Touchable onPress={props.onPress}>
      <Flex mb={4} pl={2} opacity={props.selected ? 0.4 : 1}>
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
      {props.selected ? (
        <Flex position="absolute" top={1} right={1} alignItems="center" justifyContent="center">
          <CheckCircleFillIcon height={30} width={30} fill="blue100" />
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
