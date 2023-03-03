import { useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { AlbumArtworksQuery } from "__generated__/AlbumArtworksQuery.graphql"
import { NavigationScreens } from "app/Navigation"
import { ArtworkGridItem } from "app/components/Items/ArtworkGridItem"
import { ListEmptyComponent } from "app/components/ListEmptyComponent"
import { TabsScrollView } from "app/components/Tabs/TabsContent"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { SelectedItemArtwork } from "app/system/store/Models/SelectModeModel"
import { extractNodes } from "app/utils/extractNodes"
import { usePresentationFilteredArtworks } from "app/utils/hooks/usePresentationFilteredArtworks"
import { imageSize } from "app/utils/imageSize"
import { useCallback, useEffect } from "react"
import { isTablet } from "react-native-device-info"
import { graphql } from "react-relay"

interface AlbumArtworksProps {
  artworkIds: string[]
  onArtworksDoneLoading: (artworks: SelectedItemArtwork[]) => void
}

export const AlbumArtworks: React.FC<AlbumArtworksProps> = ({
  artworkIds,
  onArtworksDoneLoading,
}) => {
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const partnerID = GlobalStore.useAppState((state) => state.auth.activePartnerID)!
  const space = useSpace()

  const artworksData = useSystemQueryLoader<AlbumArtworksQuery>(albumArtworksQuery, {
    partnerID,
    artworkIDs: artworkIds,
    imageSize,
  })
  const artworks =
    artworkIds.length > 0 ? extractNodes(artworksData.partner?.artworksConnection) : []

  // Filterering based on presentation mode
  const presentedArtworks = usePresentationFilteredArtworks(artworks)
  const numColumns = isTablet() ? 3 : 2

  useEffect(() => {
    const artworks = extractNodes(artworksData.partner?.artworksConnection)

    // Pass artworks to parent component so that the emailer has access to them
    // if invoked from the bottom sheet
    onArtworksDoneLoading(artworks as SelectedItemArtwork[])
  }, [artworksData, onArtworksDoneLoading])

  const renderItem = useCallback(
    ({ item: artwork, i }) => (
      <ArtworkGridItem
        artwork={artwork}
        style={{
          marginLeft: i % numColumns === 0 ? 0 : space(1),
          marginRight: i % numColumns === numColumns - 1 ? space(1) : 0,
        }}
        onPress={() => {
          navigation.navigate("Artwork", {
            slug: artwork.slug,
          })
        }}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <TabsScrollView>
      <MasonryList
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
  )
}

export const albumArtworksQuery = graphql`
  query AlbumArtworksQuery($partnerID: String!, $artworkIDs: [String], $imageSize: Int!) {
    partner(id: $partnerID) {
      artworksConnection(first: 100, artworkIDs: $artworkIDs, includeUnpublished: true) {
        edges {
          node {
            ...ArtworkGridItem_artwork
            ...Artwork_artworkProps @relay(mask: false)

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
