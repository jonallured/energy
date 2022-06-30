import { graphql, useLazyLoadQuery } from "react-relay"
import { TabsScrollView } from "app/wrappers"
import MasonryList from "@react-native-seoul/masonry-list"
import { extractNodes } from "shared/utils"
import { ShowArtworksQuery } from "__generated__/ShowArtworksQuery.graphql"
import { ArtworkGridItem } from "app/sharedUI"

export const ShowArtworks = ({ slug }: { slug: string }) => {
  const artworksData = useLazyLoadQuery<ShowArtworksQuery>(showArtworksQuery, { slug })
  const artworks = extractNodes(artworksData.show?.artworksConnection)

  return (
    <TabsScrollView>
      <MasonryList
        testID="show-artwork-list"
        contentContainerStyle={{
          marginTop: 20,
          paddingRight: 20,
        }}
        numColumns={2}
        data={artworks}
        renderItem={({ item: artwork }) => <ArtworkGridItem artwork={artwork} />}
        keyExtractor={(item) => item.internalID!}
      />
    </TabsScrollView>
  )
}

const showArtworksQuery = graphql`
  query ShowArtworksQuery($slug: String!) {
    show(id: $slug) {
      artworksConnection(first: 100) {
        edges {
          node {
            internalID
            ...ArtworkGridItem_artwork
          }
        }
      }
    }
  }
`
