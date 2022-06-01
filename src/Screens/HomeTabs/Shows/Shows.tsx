import { GlobalStore } from "store/GlobalStore"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import { extractNodes } from "helpers/utils/extractNodes"
import { ShowsTabQuery } from "__generated__/ShowsTabQuery.graphql"
import { Flex, Text } from "palette"
import { Image } from "react-native"
import { TabsFlatList } from "helpers/components/TabsTestWrappers"
import { Shows_show$key } from "__generated__/Shows_show.graphql"

export const Shows = () => {
  const partnerID = GlobalStore.useAppState((state) => state.activePartnerID)
  const data = useLazyLoadQuery<ShowsTabQuery>(showsQuery, { partnerID: partnerID! })
  const shows = extractNodes(data.partner?.showsConnection)

  return (
    <TabsFlatList
      data={shows}
      renderItem={({ item: show }) => <ShowOverview show={show} />}
      keyExtractor={(item) => item?.internalID!}
    />
  )
}

const showsQuery = graphql`
  query ShowsTabQuery($partnerID: String!) {
    partner(id: $partnerID) {
      showsConnection(first: 100) {
        totalCount
        edges {
          node {
            internalID
            ...Shows_show
          }
        }
      }
    }
  }
`
interface ShowOverviewProps {
  show: Shows_show$key
}

export const ShowOverview: React.FC<ShowOverviewProps> = (props) => {
  const show = useFragment<Shows_show$key>(ShowFragment, props.show)
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

const ShowFragment = graphql`
  fragment Shows_show on Show {
    name
    formattedStartAt: startAt(format: "MMMM D")
    formattedEndAt: endAt(format: "MMMM D, YYYY")
    coverImage {
      url
    }
  }
`
