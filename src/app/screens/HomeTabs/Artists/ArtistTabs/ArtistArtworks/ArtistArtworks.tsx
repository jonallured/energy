import { MasonryList } from "@react-native-seoul/masonry-list"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtistArtworksQuery } from "__generated__/ArtistArtworksQuery.graphql"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { ArtworkGridItem, ListEmptyComponent } from "app/sharedUI"
import { TabsScrollView } from "app/wrappers"
import { useSpace } from "palette"
import { extractNodes } from "shared/utils"

export const ArtistArtworks = ({ slug }: { slug: string }) => {
  const artworksData = useLazyLoadQuery<ArtistArtworksQuery>(artistArtworksQuery, { slug })
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const artworks = extractNodes(artworksData.artist?.artworksConnection)
  const artworkSlugs = artworks.map((artwork) => artwork.slug)
  const space = useSpace()

  return (
    <TabsScrollView>
      <MasonryList
        testID="artist-artwork-list"
        contentContainerStyle={{
          marginTop: artworks.length ? space(2) : 0,
          paddingRight: space(2),
        }}
        numColumns={2}
        data={artworks}
        renderItem={({ item: artwork }) => (
          <ArtworkGridItem
            artwork={artwork}
            onPress={() =>
              navigation.navigate("Artwork", {
                slug: artwork.slug,
                contextArtworkSlugs: artworkSlugs,
              })
            }
          />
        )}
        keyExtractor={(item) => item.internalID}
        ListEmptyComponent={<ListEmptyComponent text={"No artworks"} />}
      />
    </TabsScrollView>
  )
}

export const artistArtworksQuery = graphql`
  query ArtistArtworksQuery($slug: String!) {
    artist(id: $slug) {
      name
      artworksConnection(first: 100) {
        edges {
          node {
            internalID
            slug
            ...ArtworkGridItem_artwork
          }
        }
      }
    }
  }
`
