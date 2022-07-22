import { graphql, useLazyLoadQuery } from "react-relay"
import { TabsScrollView } from "app/wrappers"
import MasonryList from "@react-native-seoul/masonry-list"
import { extractNodes } from "shared/utils"
import { ShowArtworksQuery } from "__generated__/ShowArtworksQuery.graphql"
import { ArtworkGridItem } from "app/sharedUI"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"
import { useSpace } from "palette"

export const ShowArtworks = ({ slug }: { slug: string }) => {
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const artworksData = useLazyLoadQuery<ShowArtworksQuery>(showArtworksQuery, { slug })
  const artworks = extractNodes(artworksData.show?.artworksConnection)
  const artworkSlugs = artworks.map((artwork) => artwork.slug)
  const space = useSpace()

  return (
    <TabsScrollView>
      <MasonryList
        testID="show-artwork-list"
        contentContainerStyle={{
          marginTop: space(2),
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
            slug
            ...ArtworkGridItem_artwork
          }
        }
      }
    }
  }
`
