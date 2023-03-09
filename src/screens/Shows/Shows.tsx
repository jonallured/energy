import { Touchable } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { ShowsQuery } from "__generated__/ShowsQuery.graphql"
import { ShowListItem } from "components/Items/ShowListItem"
import { ListEmptyComponent } from "components/ListEmptyComponent"
import { TabsFlatList } from "components/Tabs/TabsContent"
import { useWindowDimensions } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql } from "react-relay"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { GlobalStore } from "system/store/GlobalStore"
import { extractNodes } from "utils/extractNodes"
import { getContentContainerStyle } from "utils/getContentContainerStyle"

export const Shows = () => {
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const partnerID = GlobalStore.useAppState((state) => state.auth.activePartnerID)
  const data = useSystemQueryLoader<ShowsQuery>(showsQuery, { partnerID: partnerID! })
  const shows = extractNodes(data.partner?.showsConnection)
  const screenWidth = useWindowDimensions().width

  return (
    <TabsFlatList
      columnWrapperStyle={
        isTablet() ? { justifyContent: "space-between", alignItems: "flex-start" } : null
      }
      data={shows}
      numColumns={isTablet() ? 2 : 1}
      contentContainerStyle={getContentContainerStyle(shows)}
      renderItem={({ item: show }) => {
        if (show.artworksCount && show.artworksCount > 0) {
          return (
            <Touchable
              onPress={() =>
                navigation.navigate("ShowTabs", {
                  slug: show.slug,
                })
              }
              style={{ width: isTablet() ? (screenWidth - 60) / 2 : "auto" }}
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

export const showsQuery = graphql`
  query ShowsQuery($partnerID: String!) {
    partner(id: $partnerID) {
      showsConnection(first: 100, status: ALL) {
        edges {
          node {
            ...ShowListItem_show
            internalID
            slug
            artworksCount
          }
        }
      }
    }
  }
`
