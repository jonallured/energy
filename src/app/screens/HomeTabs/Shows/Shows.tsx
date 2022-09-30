import { NavigationProp, useNavigation } from "@react-navigation/native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ShowsTabQuery } from "__generated__/ShowsTabQuery.graphql"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { ShowListItem, ListEmptyComponent } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { imageSize } from "app/utils/imageSize"
import { TabsFlatList } from "app/wrappers"
import { Touchable } from "palette"
import { extractNodes } from "shared/utils"

export const Shows = () => {
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const partnerID = GlobalStore.useAppState((state) => state.activePartnerID)
  const data = useLazyLoadQuery<ShowsTabQuery>(showsQuery, { partnerID: partnerID!, imageSize })
  const shows = extractNodes(data.partner?.showsConnection)

  return (
    <TabsFlatList
      data={shows}
      renderItem={({ item: show }) => {
        if (show.artworksCount && show.artworksCount > 0) {
          return (
            <Touchable
              onPress={() =>
                navigation.navigate("ShowTabs", {
                  slug: show.slug,
                })
              }
            >
              <ShowListItem show={show} />
            </Touchable>
          )
        } else {
          return null
        }
      }}
      keyExtractor={(item) => item?.internalID}
      ListEmptyComponent={<ListEmptyComponent text="No shows" />}
    />
  )
}

const showsQuery = graphql`
  query ShowsTabQuery($partnerID: String!, $imageSize: Int!) {
    partner(id: $partnerID) {
      showsConnection(first: 100, status: ALL) {
        edges {
          node {
            internalID
            slug
            artworksCount
            ...ShowListItem_show @arguments(imageSize: $imageSize)
          }
        }
      }
    }
  }
`
