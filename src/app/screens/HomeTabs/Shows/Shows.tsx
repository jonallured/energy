import { NavigationProp, useNavigation } from "@react-navigation/native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ShowsTabQuery } from "__generated__/ShowsTabQuery.graphql"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { ShowListItem, ListEmptyComponent } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { TabsFlatList } from "app/wrappers"
import { Touchable } from "palette"
import { extractNodes } from "shared/utils"

export const Shows = () => {
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const partnerID = GlobalStore.useAppState((state) => state.activePartnerID)
  const data = useLazyLoadQuery<ShowsTabQuery>(showsQuery, { partnerID: partnerID! })
  const shows = extractNodes(data.partner?.showsConnection)

  return (
    <TabsFlatList
      data={shows}
      renderItem={({ item: show }) => (
        <Touchable
          onPress={() => {
            navigation.navigate("ShowTabs", {
              slug: show.slug || "",
            })
          }}
        >
          <ShowListItem show={show} />
        </Touchable>
      )}
      keyExtractor={(item) => item?.internalID!}
      ListEmptyComponent={<ListEmptyComponent text="No shows" />}
    />
  )
}

const showsQuery = graphql`
  query ShowsTabQuery($partnerID: String!) {
    partner(id: $partnerID) {
      showsConnection(first: 100, status: ALL) {
        edges {
          node {
            internalID
            slug
            ...ShowListItem_show
          }
        }
      }
    }
  }
`
