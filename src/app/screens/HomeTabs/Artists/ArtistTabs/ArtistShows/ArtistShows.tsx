import { NavigationProp, useNavigation } from "@react-navigation/native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtistShowsQuery } from "__generated__/ArtistShowsQuery.graphql"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { ShowListItem, ListEmptyComponent } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { imageSize } from "app/utils/imageSize"
import { TabsFlatList } from "app/wrappers"
import { Touchable } from "palette"
import { extractNodes } from "shared/utils"

export const ArtistShows = ({ slug }: { slug: string }) => {
  const partnerID = GlobalStore.useAppState((state) => state.activePartnerID)!
  const isSelectModeActive = GlobalStore.useAppState((state) => state.selectMode.isSelectModeActive)
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const showsData = useLazyLoadQuery<ArtistShowsQuery>(artistShowsQuery, {
    partnerID,
    slug,
    imageSize,
  })
  const shows = extractNodes(showsData.partner?.showsConnection)

  return (
    <TabsFlatList
      data={shows}
      renderItem={({ item: show }) => (
        <Touchable
          onPress={() =>
            navigation.navigate("ShowTabs", {
              slug: show.slug,
            })
          }
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
