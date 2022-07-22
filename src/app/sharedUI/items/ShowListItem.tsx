import { Image } from "react-native"
import { graphql, useFragment } from "react-relay"
import { ShowListItem_show$key } from "__generated__/ShowListItem_show.graphql"
import { Flex, Text } from "palette"

interface ShowListItemProps {
  show: ShowListItem_show$key
}

export const ShowListItem: React.FC<ShowListItemProps> = (props) => {
  const show = useFragment<ShowListItem_show$key>(ShowListItemFragment, props.show)
  return (
    <Flex m={2}>
      <Image
        style={{ height: 200 }}
        resizeMode="cover"
        source={{ uri: show.coverImage?.url ?? "" }}
      />
      <Text variant="xs" color="black100" mt={1}>
        {show?.name}
      </Text>
      <Text variant="xs" color="black60">
        {show.formattedStartAt} - {show.formattedEndAt}
      </Text>
    </Flex>
  )
}

const ShowListItemFragment = graphql`
  fragment ShowListItem_show on Show {
    name
    formattedStartAt: startAt(format: "MMMM D")
    formattedEndAt: endAt(format: "MMMM D, YYYY")
    coverImage {
      url
    }
  }
`
