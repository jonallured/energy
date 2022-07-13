import { graphql, useLazyLoadQuery } from "react-relay"
import { TabsScrollView } from "app/wrappers"
import MasonryList from "@react-native-seoul/masonry-list"
import { extractNodes } from "shared/utils"
import { ArtistArtworksQuery } from "__generated__/ArtistArtworksQuery.graphql"
import { ArtworkGridItem, ListEmptyComponent } from "app/sharedUI"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"

export const ArtistArtworks = ({ slug }: { slug: string }) => {
  const artworksData = useLazyLoadQuery<ArtistArtworksQuery>(artistArtworksQuery, { slug })
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const artworks = extractNodes(artworksData.artist?.artworksConnection)
  const artworkSlugs = artworks.map((artwork) => artwork.slug)

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
        keyExtractor={(item) => item.internalID!}
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
