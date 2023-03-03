import { useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { ArtistArtworksQuery } from "__generated__/ArtistArtworksQuery.graphql"
import { NavigationScreens } from "app/Navigation"
import { ArtworkGridItem } from "app/components/Items/ArtworkGridItem"
import { ListEmptyComponent } from "app/components/ListEmptyComponent"
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

interface ArtistArtworkProps {
  slug: string
}

export const ArtistArtworks: React.FC<ArtistArtworkProps> = ({ slug }) => {
  const partnerID = GlobalStore.useAppState((state) => state.auth.activePartnerID)!
  const artworksData = useSystemQueryLoader<ArtistArtworksQuery>(artistArtworksQuery, {
    partnerID,
    slug,
    imageSize,
  })

  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const artworks = extractNodes(artworksData.partner?.artworksConnection)
  const artworkSlugs = artworks.map((artwork) => artwork.slug)

  const isSelectModeActive = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.isActive
  )
  const selectedItems = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.selectedItems
  )

  const space = useSpace()

  const selectArtworkHandler = (artwork: (typeof artworks)[0]) => {
    GlobalStore.actions.selectMode.toggleSelectedItem(artwork)
  }

  // Filterering based on presentation mode
  const presentedArtworks = usePresentationFilteredArtworks(artworks)
  const numColumns = isTablet() ? 3 : 2

  const activeTab = useFocusedTab()
  const allSelected = isAllSelected(selectedItems, presentedArtworks)

  const renderItem = useCallback(({ item: artwork, i }) => {
    return (
      <ArtworkGridItem
        artwork={artwork}
        onPress={() =>
          isSelectModeActive
            ? selectArtworkHandler(artwork)
            : navigation.navigate("Artwork", {
                slug: artwork.slug,
                contextArtworkSlugs: artworkSlugs,
              })
        }
        selectedToAdd={isSelected(selectedItems, artwork)}
        pl={i % numColumns === 0 ? undefined : 1}
        pr={i % numColumns === numColumns - 1 ? undefined : 1}
      />
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Portal active={activeTab === "ArtistArtworks"}>
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
          testID="artist-artwork-list"
          contentContainerStyle={{
            marginTop: space(2),
            paddingHorizontal: space(2),
          }}
          numColumns={numColumns}
          data={presentedArtworks}
          renderItem={renderItem}
          keyExtractor={(item) => item.internalID}
          ListEmptyComponent={<ListEmptyComponent text="No artworks" />}
          removeClippedSubviews
        />
      </TabsScrollView>
    </>
  )
}

export const artistArtworksQuery = graphql`
  query ArtistArtworksQuery($partnerID: String!, $slug: String!, $imageSize: Int!) {
    partner(id: $partnerID) {
      artworksConnection(first: 100, artistID: $slug, includeUnpublished: true) {
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
