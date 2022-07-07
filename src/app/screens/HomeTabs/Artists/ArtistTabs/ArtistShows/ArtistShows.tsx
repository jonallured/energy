import { graphql, useLazyLoadQuery } from "react-relay"
import { TabsFlatList } from "app/wrappers"
import { extractNodes } from "shared/utils"
import { ArtistShowsQuery } from "__generated__/ArtistShowsQuery.graphql"
import { ShowListItem, ListEmptyComponent } from "app/sharedUI"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"
import { Touchable } from "palette"

export const ArtistShows = ({ slug }: { slug: string }) => {
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const showsData = useLazyLoadQuery<ArtistShowsQuery>(artistShowsQuery, { slug })
  const shows = extractNodes(showsData.artist?.showsConnection)

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
