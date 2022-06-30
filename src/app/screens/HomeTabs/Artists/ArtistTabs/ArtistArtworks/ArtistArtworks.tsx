import { graphql, useLazyLoadQuery } from "react-relay"
import { TabsScrollView } from "app/wrappers"
import MasonryList from "@react-native-seoul/masonry-list"
import { extractNodes } from "shared/utils"
import { ArtistArtworksQuery } from "__generated__/ArtistArtworksQuery.graphql"
import { ArtworkGridItem, ListEmptyComponent } from "app/sharedUI"

export const ArtistArtworks = ({ slug }: { slug: string }) => {
  const artworksData = useLazyLoadQuery<ArtistArtworksQuery>(artistArtworksQuery, { slug })
  const artworks = extractNodes(artworksData.artist?.artworksConnection)
  return (
    <TabsScrollView>
      <MasonryList
        testID="artist-artwork-list"
        contentContainerStyle={{
          marginTop: artworks.length ? 20 : 0,
          paddingRight: 20,
        }}
        numColumns={2}
        data={artworks}
        renderItem={({ item: artwork }) => <ArtworkGridItem artwork={artwork} />}
        keyExtractor={(item) => item.internalID!}
        ListEmptyComponent={<ListEmptyComponent text={"No artworks"} />}
      />
    </TabsScrollView>
  )
}

const artistArtworksQuery = graphql`
  query ArtistArtworksQuery($slug: String!) {
    artist(id: $slug) {
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
