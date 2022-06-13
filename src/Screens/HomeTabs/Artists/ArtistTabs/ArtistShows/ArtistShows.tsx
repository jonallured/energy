import { graphql, useLazyLoadQuery } from "react-relay"
import { TabsFlatList } from "Screens/_helpers/TabsTestWrappers"
import { ShowListItem } from "Screens/_shared/ShowListItem"
import { extractNodes } from "shared/utils/extractNodes"
import { ArtistShowsQuery } from "__generated__/ArtistShowsQuery.graphql"

export const ArtistShows = ({ slug }: { slug: string }) => {
  const showsData = useLazyLoadQuery<ArtistShowsQuery>(artistShowsQuery, { slug })
  const shows = extractNodes(showsData.artist?.showsConnection)

  return (
    <TabsFlatList
      data={shows}
      renderItem={({ item: show }) => <ShowListItem show={show} />}
      keyExtractor={(item) => item?.internalID!}
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
            ...ShowListItem_show
          }
        }
      }
    }
  }
`
