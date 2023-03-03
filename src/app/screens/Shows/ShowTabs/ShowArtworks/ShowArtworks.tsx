import { useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { ShowArtworksQuery } from "__generated__/ShowArtworksQuery.graphql"
import { NavigationScreens } from "app/Navigation"
import { ArtworkGridItem } from "app/components/Items/ArtworkGridItem"
import { Portal } from "app/components/Portal"
import { isAllSelected, isSelected, SelectMode } from "app/components/SelectMode"
import { TabsScrollView } from "app/components/Tabs/TabsContent"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { usePresentationFilteredArtworks } from "app/utils/hooks/usePresentationFilteredArtworks"
import { imageSize } from "app/utils/imageSize"
import { useCallback } from "react"
import { useFocusedTab } from "react-native-collapsible-tab-view"
import { isTablet } from "react-native-device-info"
import { graphql } from "react-relay"

export const ShowArtworks = ({ slug }: { slug: string }) => {
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const artworksData = useSystemQueryLoader<ShowArtworksQuery>(showArtworksQuery, {
    slug,
    imageSize,
  })
  const artworks = extractNodes(artworksData.show?.artworksConnection)
  const artworkSlugs = artworks.map((artwork) => artwork.slug)
  const space = useSpace()

  // Filterering based on presentation mode
  const presentedArtworks = usePresentationFilteredArtworks(artworks)

  const isSelectModeActive = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.isActive
  )
  const selectedItems = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.selectedItems
  )

  const activeTab = useFocusedTab()
  const allSelected = isAllSelected(selectedItems, presentedArtworks)

  const renderItem = useCallback(
    ({ item: artwork, i }) => (
      <ArtworkGridItem
        artwork={artwork}
        onPress={() =>
          isSelectModeActive
            ? GlobalStore.actions.selectMode.toggleSelectedItem(artwork)
            : navigation.navigate("Artwork", {
                slug: artwork.slug,
                contextArtworkSlugs: artworkSlugs,
              })
        }
        selectedToAdd={isSelected(selectedItems, artwork)}
        style={{
          marginLeft: i % 2 === 0 ? 0 : space(1),
          marginRight: i % 2 === 0 ? space(1) : 0,
        }}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <>
      <Portal active={activeTab === "ShowArtworks"}>
        <SelectMode
          allSelected={allSelected}
          selectAll={() => {
            GlobalStore.actions.selectMode.selectItems(artworks)
          }}
          unselectAll={() => {
            GlobalStore.actions.selectMode.clearSelectedItems()
          }}
        />
      </Portal>
      <TabsScrollView>
        <MasonryList
          testID="show-artwork-list"
          contentContainerStyle={{
            marginTop: space(2),
            paddingHorizontal: space(2),
          }}
          numColumns={isTablet() ? 3 : 2}
          data={presentedArtworks}
          renderItem={renderItem}
          keyExtractor={(item) => item.internalID}
          removeClippedSubviews
        />
      </TabsScrollView>
    </>
  )
}

export const showArtworksQuery = graphql`
  query ShowArtworksQuery($slug: String!, $imageSize: Int!) {
    show(id: $slug) {
      artworksConnection(first: 100) {
        edges {
          node {
            ...Artwork_artworkProps @relay(mask: false)
            ...ArtworkGridItem_artwork @arguments(imageSize: $imageSize)

            image {
              resized(width: $imageSize, version: "normalized") {
                height
                url
              }
              aspectRatio
            }
          }
        }
      }
    }
  }
`
