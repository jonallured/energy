import { useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ShowArtworksQuery } from "__generated__/ShowArtworksQuery.graphql"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { ArtworkGridItem } from "app/sharedUI"
import { imageSize } from "app/utils/imageSize"
import { TabsScrollView } from "app/wrappers"
import { extractNodes } from "shared/utils"

export const ShowArtworks = ({ slug }: { slug: string }) => {
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const artworksData = useLazyLoadQuery<ShowArtworksQuery>(showArtworksQuery, { slug, imageSize })
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
        keyExtractor={(item) => item.internalID}
      />
    </TabsScrollView>
  )
}

const showArtworksQuery = graphql`
  query ShowArtworksQuery($slug: String!, $imageSize: Int!) {
    show(id: $slug) {
      artworksConnection(first: 100) {
        edges {
          node {
            internalID
            slug
            ...ArtworkGridItem_artwork @arguments(imageSize: $imageSize)
          }
        }
      }
    }
  }
`
