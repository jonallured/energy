import { Touchable } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useWindowDimensions } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql } from "react-relay"
import { ArtistShowsQuery } from "__generated__/ArtistShowsQuery.graphql"
import { NavigationScreens } from "app/Navigation"
import { ShowListItem } from "app/components/Items/ShowListItem"
import { ListEmptyComponent } from "app/components/ListEmptyComponent"
import { TabsFlatList } from "app/components/Tabs/TabsContent"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { extractNodes } from "app/utils"
import { imageSize } from "app/utils/imageSize"

export const ArtistShows = ({ slug }: { slug: string }) => {
  const partnerID = GlobalStore.useAppState((state) => state.activePartnerID)!
  const isSelectModeActive = GlobalStore.useAppState((state) => state.selectMode.isActive)
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const showsData = useSystemQueryLoader<ArtistShowsQuery>(artistShowsQuery, {
    partnerID,
    slug,
    imageSize,
  })
  const shows = extractNodes(showsData.partner?.showsConnection)
  const screenWidth = useWindowDimensions().width
  const margin = 20

  return (
    <TabsFlatList
      columnWrapperStyle={
        isTablet() ? { justifyContent: "space-between", alignItems: "flex-start" } : null
      }
      data={shows}
      numColumns={isTablet() ? 2 : 1}
      renderItem={({ item: show }) => (
        <Touchable
          onPress={() =>
            navigation.navigate("ShowTabs", {
              slug: show.slug,
            })
          }
          style={{ width: isTablet() ? (screenWidth - margin * 3) / 2 : undefined }}
          disabled={isSelectModeActive}
        >
          <ShowListItem show={show} disabled={isSelectModeActive} />
        </Touchable>
      )}
      keyExtractor={(item) => item?.internalID}
      ListEmptyComponent={<ListEmptyComponent text="No shows" />}
    />
  )
}

export const artistShowsQuery = graphql`
  query ArtistShowsQuery($partnerID: String!, $slug: String!, $imageSize: Int!) @raw_response_type {
    partner(id: $partnerID) {
      showsConnection(first: 100, status: ALL, artistID: $slug) {
        edges {
          node {
            ...ShowListItem_show @arguments(imageSize: $imageSize)
            internalID
            slug
            coverImage {
              resized(width: $imageSize, version: "normalized") {
                url
              }
            }
          }
        }
      }
    }
  }
`
