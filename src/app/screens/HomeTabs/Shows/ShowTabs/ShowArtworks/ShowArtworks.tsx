import { useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { isEqual } from "lodash"
import { isTablet } from "react-native-device-info"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ShowArtworksQuery } from "__generated__/ShowArtworksQuery.graphql"
import { NavigationScreens } from "app/navigation/Main"
import { usePresentationFilteredArtworks } from "app/screens/HomeTabs/usePresentationFilteredArtworks"
import { ArtworkGridItem } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { useHeaderSelectModeInTab } from "app/store/selectModeAtoms"
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

  const isSelectModeActive = GlobalStore.useAppState((state) => state.selectMode.isSelectModeActive)
  const selectedArtworkIds = GlobalStore.useAppState((state) => state.selectMode.items.works)
  useHeaderSelectModeInTab("ShowArtworks", {
    allSelected: isEqual(
      new Set(selectedArtworkIds),
      new Set(presentedArtworks.map((a) => a.internalID))
    ),
    selectAllFn: () =>
      void GlobalStore.actions.selectMode.selectAllItems({
        itemType: "works",
        allItems: artworks.map((a) => a.internalID),
      }),
    unselectAllFn: () =>
      void GlobalStore.actions.selectMode.selectAllItems({
        itemType: "works",
        allItems: [],
      }),
  })

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
              isSelectModeActive
                ? GlobalStore.actions.selectMode.selectItem({
                    itemType: "works",
                    item: artwork.internalID,
                  })
                : navigation.navigate("Artwork", {
                    slug: artwork.slug,
                    contextArtworkSlugs: artworkSlugs,
                  })
            }
            selectedToAdd={selectedArtworkIds.includes(artwork.internalID)}
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
