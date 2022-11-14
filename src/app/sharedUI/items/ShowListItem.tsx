import { Flex, Text } from "@artsy/palette-mobile"
import { Image } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment } from "react-relay"
import { ShowListItem_show$key } from "__generated__/ShowListItem_show.graphql"
import { ImagePlaceholder } from "app/sharedUI"

interface ShowListItemProps {
  show: ShowListItem_show$key
  disabled?: boolean
}

export const ShowListItem: React.FC<ShowListItemProps> = (props) => {
  const show = useFragment<ShowListItem_show$key>(ShowListItemFragment, props.show)
  const fontSize = isTablet() ? "sm" : "xs"

  return (
    <Flex mx="2" my="2" opacity={props.disabled ? 0.4 : 1}>
      {show.coverImage?.resized?.url ? (
        <Image
          style={{ height: 200 }}
          resizeMode="cover"
          source={{ uri: show.coverImage.resized.url }}
        />
      ) : (
        <ImagePlaceholder height={200} />
      )}
      <Flex width="100%">
        <Text variant={fontSize} mt="1">
          {show?.name}
        </Text>
        <Text variant={fontSize} color="onBackgroundMedium">
          {show.formattedStartAt} - {show.formattedEndAt}
        </Text>
      </Flex>
    </Flex>
  )
}

const ShowListItemFragment = graphql`
  fragment ShowListItem_show on Show @argumentDefinitions(imageSize: { type: "Int" }) {
    name
    formattedStartAt: startAt(format: "MMMM D")
    formattedEndAt: endAt(format: "MMMM D, YYYY")
    coverImage {
      resized(width: $imageSize, version: "normalized") {
        url
      }
    }
  }
`
