import { GlobalStore } from "app/store/GlobalStore"
import { graphql, useLazyLoadQuery } from "react-relay"
import { extractNodes } from "shared/utils/extractNodes"
import { Touchable } from "palette"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"
import { ShowsTabQuery } from "__generated__/ShowsTabQuery.graphql"
import { TabsFlatList } from "app/wrappers/TabsTestWrappers"
import { SuspenseWrapper } from "app/wrappers/SuspenseWrapper"
import { ShowListItem } from "app/sharedUI/items/ShowListItem"

export const Shows = () => {
  return (
    <SuspenseWrapper withTabs>
      <RenderShows />
    </SuspenseWrapper>
  )
}

const RenderShows = () => {
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
    />
  )
}

const showsQuery = graphql`
  query ShowsTabQuery($partnerID: String!) {
    partner(id: $partnerID) {
      showsConnection(first: 100) {
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
