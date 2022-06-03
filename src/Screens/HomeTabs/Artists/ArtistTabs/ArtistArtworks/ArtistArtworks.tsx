import { graphql, useLazyLoadQuery } from "react-relay"
import { TabsFlatList } from "Screens/_helpers/TabsTestWrappers"
import MasonryList from "@react-native-seoul/masonry-list"
import { extractNodes } from "shared/utils/extractNodes"
import { ArtistArtworksQuery } from "__generated__/ArtistArtworksQuery.graphql"
import { ArtworkGridItem } from "Screens/_shared/ArtworkGridItem"

export const ArtistArtworks = ({ slug }: { slug: string }) => {
  const artworksData = useLazyLoadQuery<ArtistArtworksQuery>(artistArtworksQuery, { slug })
  const artworks = extractNodes(artworksData.artist?.artworksConnection)

  return (
    <TabsFlatList // We still want to use TabFlatlist for collapsible header feature
      data={[0]} // This should be 0 as TabsFlatlist needs atleast a single data
      renderItem={() => (
        <MasonryList
          testID="artist-artwork-list"
          contentContainerStyle={{
            marginTop: 20,
            paddingRight: 20,
          }}
          numColumns={2}
          data={artworks}
          renderItem={({ item: artwork }) => <ArtworkGridItem artwork={artwork} />}
          keyExtractor={(item) => item.internalID!}
        />
      )}
    />
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