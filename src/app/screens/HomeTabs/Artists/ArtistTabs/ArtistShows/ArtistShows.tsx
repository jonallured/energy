import { Flex, Touchable } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useWindowDimensions } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtistShowsQuery } from "__generated__/ArtistShowsQuery.graphql"
import { NavigationScreens } from "app/navigation/Main"
import { ShowListItem, ListEmptyComponent } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { imageSize } from "app/utils/imageSize"
import { TabsFlatList } from "app/wrappers"
import { SCREEN_HORIZONTAL_PADDING } from "palette/organisms/Screen/exposed/Body"
import { extractNodes } from "shared/utils"

export const ArtistShows = ({ slug }: { slug: string }) => {
  const partnerID = GlobalStore.useAppState((state) => state.activePartnerID)!
  const isSelectModeActive = GlobalStore.useAppState((state) => state.selectMode.isActive)
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const showsData = useLazyLoadQuery<ArtistShowsQuery>(artistShowsQuery, {
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
      ListEmptyComponent={
        <Flex mx={SCREEN_HORIZONTAL_PADDING}>
          <ListEmptyComponent text="No shows" />
        </Flex>
      }
    />
  )
}

const artistShowsQuery = graphql`
  query ArtistShowsQuery($partnerID: String!, $slug: String!, $imageSize: Int!) {
    partner(id: $partnerID) {
      showsConnection(first: 100, status: ALL, artistID: $slug) {
        edges {
          node {
            internalID
            slug
            ...ShowListItem_show @arguments(imageSize: $imageSize)
          }
        }
      }
    }
  }
`
