import { GlobalStore } from "store/GlobalStore"
import { graphql, useLazyLoadQuery } from "react-relay"
import { extractNodes } from "shared/utils/extractNodes"
import { ShowsTabQuery } from "__generated__/ShowsTabQuery.graphql"
import { TabsFlatList } from "Screens/_helpers/TabsTestWrappers"
import { ShowListItem } from "../../_shared/ShowListItem"

export const Shows = () => {
  const partnerID = GlobalStore.useAppState((state) => state.activePartnerID)
  const data = useLazyLoadQuery<ShowsTabQuery>(showsQuery, { partnerID: partnerID! })
  const shows = extractNodes(data.partner?.showsConnection)

  return (
    <TabsFlatList
      data={shows}
      renderItem={({ item: show }) => <ShowListItem show={show} />}
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
            ...ShowListItem_show
          }
        }
      }
    }
  }
`
