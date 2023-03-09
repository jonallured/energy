import { Flex, Text } from "@artsy/palette-mobile"
import { ShowListItem_show$key } from "__generated__/ShowListItem_show.graphql"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment } from "react-relay"
import { CachedImage } from "system/wrappers/CachedImage"

interface ShowListItemProps {
  show: ShowListItem_show$key
  disabled?: boolean
}

export const ShowListItem: React.FC<ShowListItemProps> = (props) => {
  const show = useFragment<ShowListItem_show$key>(ShowListItemFragment, props.show)
  const fontSize = isTablet() ? "sm" : "xs"

  return (
    <Flex mx={2} my={2} opacity={props.disabled ? 0.4 : 1}>
      <CachedImage
        uri={show?.coverImage?.url as string}
        resizeMode="cover"
        width="100%"
        height={200}
        placeholderHeight={200}
        aspectRatio={null}
      />
      <Flex width="100%">
        {show?.name && (
          <Text variant={fontSize} mt={1}>
            {show.name}
          </Text>
        )}
        <Text variant={fontSize} color="onBackgroundMedium">
          {show.formattedStartAt} - {show.formattedEndAt}
        </Text>
      </Flex>
    </Flex>
  )
}

const ShowListItemFragment = graphql`
  fragment ShowListItem_show on Show {
    name
    formattedStartAt: startAt(format: "MMMM D")
    formattedEndAt: endAt(format: "MMMM D, YYYY")
    coverImage {
      width
      height
      url
      aspectRatio
    }
  }
`
