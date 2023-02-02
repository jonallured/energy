import { useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { isEqual } from "lodash"
import { isTablet } from "react-native-device-info"
import { graphql } from "react-relay"
import { ArtistArtworksQuery } from "__generated__/ArtistArtworksQuery.graphql"
import { NavigationScreens } from "app/Navigation"
import { ArtworkGridItem } from "app/components/Items/ArtworkGridItem"
import { ListEmptyComponent } from "app/components/ListEmptyComponent"
import { TabsScrollView } from "app/components/Tabs/TabsContent"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { useHeaderSelectModeInTab } from "app/system/store/selectModeAtoms"
import { extractNodes } from "app/utils/extractNodes"
import { usePresentationFilteredArtworks } from "app/utils/hooks/usePresentationFilteredArtworks"
import { imageSize } from "app/utils/imageSize"

export const ArtistArtworks = ({ slug }: { slug: string }) => {
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
  const selectedArtworkIds = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.artworks
  )

  const space = useSpace()

  const selectArtworkHandler = (artwork: string) => {
    GlobalStore.actions.selectMode.toggleSelectedItem({ type: "artwork", item: artwork })
  }

  // Filterering based on presentation mode
  const presentedArtworks = usePresentationFilteredArtworks(artworks)

  useHeaderSelectModeInTab("ArtistArtworks", {
    allSelected: isEqual(
      new Set(selectedArtworkIds),
      new Set(presentedArtworks.map((a) => a.internalID))
    ),
    selectAllFn: () =>
      void GlobalStore.actions.selectMode.setSelectedItems({
        type: "artwork",
        items: artworks.map((a) => a.internalID),
      }),
    unselectAllFn: () =>
      void GlobalStore.actions.selectMode.setSelectedItems({
        type: "artwork",
        items: [],
      }),
  })

  const numColumns = isTablet() ? 3 : 2

  return (
    <>
      <TabsScrollView>
        <MasonryList
          testID="artist-artwork-list"
          contentContainerStyle={{
            marginTop: artworks.length ? space(2) : 0,
            paddingHorizontal: space(2),
          }}
          numColumns={numColumns}
          data={presentedArtworks}
          renderItem={({ item: artwork, i }) => {
            return (
              <ArtworkGridItem
                artwork={artwork}
                onPress={() =>
                  isSelectModeActive
                    ? selectArtworkHandler(artwork.internalID)
                    : navigation.navigate("Artwork", {
                        slug: artwork.slug,
                        contextArtworkSlugs: artworkSlugs,
                      })
                }
                selectedToAdd={selectedArtworkIds.includes(artwork.internalID)}
                pl={i % numColumns === 0 ? 0 : 1}
                pr={i % numColumns === numColumns - 1 ? 0 : 1}
              />
            )
          }}
          keyExtractor={(item) => item.internalID}
          ListEmptyComponent={<ListEmptyComponent text="No artworks" mx={0} />}
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
