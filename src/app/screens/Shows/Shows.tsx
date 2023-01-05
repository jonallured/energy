import { Touchable, useSpace } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useWindowDimensions } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql } from "react-relay"
import { ShowsQuery } from "__generated__/ShowsQuery.graphql"
import { NavigationScreens } from "app/Navigation"
import { ShowListItem } from "app/components/Items/ShowListItem"
import { ListEmptyComponent } from "app/components/ListEmptyComponent"
import { TabsFlatList } from "app/components/Tabs/TabsContent"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { imageSize } from "app/utils/imageSize"

export const Shows = () => {
  const space = useSpace()
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const partnerID = GlobalStore.useAppState((state) => state.activePartnerID)
  const data = useSystemQueryLoader<ShowsQuery>(showsQuery, { partnerID: partnerID!, imageSize })
  const shows = extractNodes(data.partner?.showsConnection)
  const screenWidth = useWindowDimensions().width

  return (
    <TabsFlatList
      columnWrapperStyle={
        isTablet() ? { justifyContent: "space-between", alignItems: "flex-start" } : null
      }
      data={shows}
      numColumns={isTablet() ? 2 : 1}
      contentContainerStyle={{ paddingBottom: space("2") }}
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
  query ShowsQuery($partnerID: String!, $imageSize: Int!) {
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
