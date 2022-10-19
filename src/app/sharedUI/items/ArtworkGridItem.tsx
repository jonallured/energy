import { CheckCircleFillIcon, Flex, Text, Touchable, TrashIcon } from "@artsy/palette-mobile"
import { Image } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment } from "react-relay"
import { ArtworkGridItem_artwork$key } from "__generated__/ArtworkGridItem_artwork.graphql"
import { AvailabilityDot } from "app/sharedUI"

interface ArtworkGridItemProps {
  artwork: ArtworkGridItem_artwork$key
  onPress?: () => void
  selectedToAdd?: boolean
  selectedToRemove?: boolean
  disable?: boolean
}

export const ArtworkGridItem: React.FC<ArtworkGridItemProps> = (props) => {
  const artwork = useFragment<ArtworkGridItem_artwork$key>(ArtworkGridItemFragment, props.artwork)
  const fontSize = isTablet() ? "sm" : "xs"

  const { disable, selectedToAdd, selectedToRemove, onPress } = props

  return (
    <Touchable disabled={disable} onPress={onPress}>
      <Flex mb={4} pl={2} opacity={disable || selectedToAdd || selectedToRemove ? 0.4 : 1}>
        <Image
          source={{ uri: artwork.image?.resized?.url! }}
          style={{
            aspectRatio: artwork.image?.aspectRatio ?? 1,
          }}
        />
        <Text italic variant={fontSize} color="onBackgroundMedium" mt={1}>
          <AvailabilityDot availability={artwork.availability} /> {artwork.title}
          {!!artwork.date && (
            <>
              ,{" "}
              <Text variant={fontSize} color="onBackgroundMedium">
                {artwork.date}
              </Text>
            </>
          )}
        </Text>
      </Flex>
      {!disable && selectedToAdd && (
        <Flex position="absolute" top={1} right={1} alignItems="center" justifyContent="center">
          <CheckCircleFillIcon height={30} width={30} fill="blue100" />
        </Flex>
      )}
      {selectedToRemove && (
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
          <TrashIcon height={20} width={20} fill="onBackgroundHigh" />
        </Flex>
      )}
    </Touchable>
  )
}

const ArtworkGridItemFragment = graphql`
  fragment ArtworkGridItem_artwork on Artwork @argumentDefinitions(imageSize: { type: "Int" }) {
    internalID
    title
    date
    image {
      resized(width: $imageSize, version: "normalized") {
        url
      }
      aspectRatio
    }
    availability
  }
`
