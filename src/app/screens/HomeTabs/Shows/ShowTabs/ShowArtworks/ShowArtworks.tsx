import { useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { isTablet } from "react-native-device-info"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ShowArtworksQuery } from "__generated__/ShowArtworksQuery.graphql"
import { NavigationScreens } from "app/navigation/Main"
import { usePresentationFilteredArtworks } from "app/screens/HomeTabs/usePresentationFilteredArtworks"
import { ArtworkGridItem } from "app/sharedUI"
import { imageSize } from "app/utils/imageSize"
import { TabsScrollView } from "app/wrappers"
import { extractNodes } from "shared/utils"

export const ShowArtworks = ({ slug }: { slug: string }) => {
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const artworksData = useLazyLoadQuery<ShowArtworksQuery>(showArtworksQuery, { slug, imageSize })
  const artworks = extractNodes(artworksData.show?.artworksConnection)
  const artworkSlugs = artworks.map((artwork) => artwork.slug)
  const space = useSpace()

  // Filterering based on presentation mode
  const presentedArtworks = usePresentationFilteredArtworks(artworks)

  return (
    <TabsScrollView>
      <MasonryList
        testID="show-artwork-list"
        contentContainerStyle={{
          marginTop: space(2),
          paddingHorizontal: space(2),
        }}
        numColumns={isTablet() ? 3 : 2}
        data={presentedArtworks}
        renderItem={({ item: artwork, i }) => (
          <ArtworkGridItem
            artwork={artwork}
            onPress={() =>
              navigation.navigate("Artwork", {
                slug: artwork.slug,
                contextArtworkSlugs: artworkSlugs,
              })
            }
            style={{
              marginLeft: i % 2 === 0 ? 0 : space("1"),
              marginRight: i % 2 === 0 ? space("1") : 0,
            }}
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
            published
            availability
            ...ArtworkGridItem_artwork @arguments(imageSize: $imageSize)
          }
        }
      }
    }
  }
`
