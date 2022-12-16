import { Flex, Touchable, useSpace } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useWindowDimensions } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql } from "react-relay"
import { ShowsQuery } from "__generated__/ShowsQuery.graphql"
import { NavigationScreens } from "app/navigation/Main"
import { useSystemQueryLoader } from "app/relay/useSystemQueryLoader"
import { ShowListItem, ListEmptyComponent } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { imageSize } from "app/utils/imageSize"
import { TabsFlatList } from "app/wrappers"
import { SCREEN_HORIZONTAL_PADDING } from "palette/organisms/Screen/exposed/Body"
import { extractNodes } from "shared/utils"

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
      contentContainerStyle={{ paddingTop: space("2"), paddingBottom: space("2") }}
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
      ListEmptyComponent={
        <Flex mx={SCREEN_HORIZONTAL_PADDING}>
          <ListEmptyComponent text="No shows" />
        </Flex>
      }
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
