import { Button, Flex, useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtistArtworksQuery } from "__generated__/ArtistArtworksQuery.graphql"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { ArtworkGridItem, ListEmptyComponent } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { TabsScrollView } from "app/wrappers"
import { extractNodes } from "shared/utils"
import { isTablet } from "react-native-device-info"

export const ArtistArtworks = ({ slug }: { slug: string }) => {
  const partnerID = GlobalStore.useAppState((state) => state.activePartnerID)!

  const artworksData = useLazyLoadQuery<ArtistArtworksQuery>(artistArtworksQuery, {
    partnerID,
    slug,
  })

  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const artworks = extractNodes(artworksData.partner?.artworksConnection)
  const artworkSlugs = artworks.map((artwork) => artwork.slug)

  const isSelectModeActive = GlobalStore.useAppState((state) => state.selectMode.isSelectModeActive)
  const selectedArtworkIds = GlobalStore.useAppState((state) => state.selectMode.items.works)
  const [areAllArtworkSelected, setAreAllArtworkSelected] = useState<boolean>(
    selectedArtworkIds.length === artworks.length
  )

  const space = useSpace()

  const selectArtworkHandler = (artwork: string) => {
    GlobalStore.actions.selectMode.selectItems({ itemType: "works", item: artwork })
    setAreAllArtworkSelected(false)
  }

  const selectAllArtworkHandler = (toggleSelectAllArtwork: boolean) => {
    if (toggleSelectAllArtwork) {
      GlobalStore.actions.selectMode.selectAllItems({
        itemType: "works",
        allItems: artworks.map((artwork) => artwork.internalID),
      })
    } else {
      GlobalStore.actions.selectMode.selectAllItems({
        itemType: "works",
        allItems: [],
      })
    }
    setAreAllArtworkSelected(toggleSelectAllArtwork)
  }

  return (
    <>
      <TabsScrollView>
        <MasonryList
          testID="artist-artwork-list"
          contentContainerStyle={{
            marginTop: artworks.length ? space(2) : 0,
            paddingRight: space(2),
          }}
          numColumns={ isTablet() ? 3 : 2}
          data={artworks}
          renderItem={({ item: artwork }) => {
            if (isSelectModeActive) {
              return (
                <ArtworkGridItem
                  artwork={artwork}
                  onPress={() => selectArtworkHandler(artwork.internalID)}
                  selectedToAdd={selectedArtworkIds.includes(artwork.internalID)}
                />
              )
            }
            return (
              <ArtworkGridItem
                artwork={artwork}
                onPress={() =>
                  navigation.navigate("Artwork", {
                    slug: artwork.slug,
                    contextArtworkSlugs: artworkSlugs,
                  })
                }
              />
            )
          }}
          keyExtractor={(item) => item.internalID}
          ListEmptyComponent={<ListEmptyComponent text="No artworks" />}
        />
      </TabsScrollView>
      {/* This should be moved to Headers */}
      {isSelectModeActive && (
        <Flex
          position="absolute"
          zIndex={3000}
          bottom={120}
          width="100%"
          justifyContent="space-between"
          flexDirection="row"
          px={2}
        >
          <Button
            variant="fillGray"
            size="small"
            onPress={() => selectAllArtworkHandler(!areAllArtworkSelected)}
          >
            {selectedArtworkIds.length === artworks.length ? "Unselect All" : "Select All"}
          </Button>
        </Flex>
      )}
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
            ...ArtworkGridItem_artwork
          }
        }
      }
    }
  }
`
