import { useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { isEqual } from "lodash"
import { isTablet } from "react-native-device-info"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtistArtworksQuery } from "__generated__/ArtistArtworksQuery.graphql"
import { NavigationScreens } from "app/navigation/Main"
import { usePresentationFilteredArtworks } from "app/screens/HomeTabs/usePresentationFilteredArtworks"
import { ArtworkGridItem, ListEmptyComponent } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { useHeaderSelectModeInTab } from "app/store/selectModeAtoms"
import { TabsScrollView } from "app/wrappers"
import { extractNodes } from "shared/utils"

export const ArtistArtworks = ({ slug }: { slug: string }) => {
  const partnerID = GlobalStore.useAppState((state) => state.activePartnerID)!

  const artworksData = useLazyLoadQuery<ArtistArtworksQuery>(artistArtworksQuery, {
    partnerID,
    slug,
  })

  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const artworks = extractNodes(artworksData.partner?.artworksConnection)
  const artworkSlugs = artworks.map((artwork) => artwork.slug)

  const isSelectModeActive = GlobalStore.useAppState((state) => state.selectMode.isSelectModeActive)
  const selectedArtworkIds = GlobalStore.useAppState((state) => state.selectMode.items.works)

  const space = useSpace()

  const selectArtworkHandler = (artwork: string) => {
    GlobalStore.actions.selectMode.selectItem({ itemType: "works", item: artwork })
  }

  // Filterering based on presentation mode
  const presentedArtworks = usePresentationFilteredArtworks(artworks)

  useHeaderSelectModeInTab("ArtistArtworks", {
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
    <>
      <TabsScrollView>
        <MasonryList
          testID="artist-artwork-list"
          contentContainerStyle={{
            marginTop: artworks.length ? space(2) : 0,
            paddingHorizontal: space(2),
          }}
          numColumns={isTablet() ? 3 : 2}
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
                style={{
                  marginLeft: i % 2 === 0 ? 0 : space("1"),
                  marginRight: i % 2 === 0 ? space("1") : 0,
                }}
              />
            )
          }}
          keyExtractor={(item) => item.internalID}
          ListEmptyComponent={<ListEmptyComponent text="No artworks" />}
        />
      </TabsScrollView>
    </>
  )
}

export const artistArtworksQuery = graphql`
  query ArtistArtworksQuery($partnerID: String!, $slug: String!) {
    partner(id: $partnerID) {
      artworksConnection(first: 100, artistID: $slug, includeUnpublished: true) {
        edges {
          node {
            internalID
            slug
            published
            availability
            ...ArtworkGridItem_artwork
          }
        }
      }
    }
  }
`
