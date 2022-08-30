import { NavigationProp, useNavigation } from "@react-navigation/native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtistShowsQuery } from "__generated__/ArtistShowsQuery.graphql"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { ShowListItem, ListEmptyComponent } from "app/sharedUI"
import { TabsFlatList } from "app/wrappers"
import { Touchable } from "palette"
import { extractNodes } from "shared/utils"

export const ArtistShows = ({ slug }: { slug: string }) => {
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const showsData = useLazyLoadQuery<ArtistShowsQuery>(artistShowsQuery, { slug })
  const shows = extractNodes(showsData.artist?.showsConnection)

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
        >
          <ShowListItem show={show} />
        </Touchable>
      )}
      keyExtractor={(item) => item?.internalID!}
      ListEmptyComponent={<ListEmptyComponent text={"No shows"} />}
    />
  )
}

const artistShowsQuery = graphql`
  query ArtistShowsQuery($slug: String!) {
    artist(id: $slug) {
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
