import { MasonryList } from "@react-native-seoul/masonry-list"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtistArtworksQuery } from "__generated__/ArtistArtworksQuery.graphql"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { ArtworkGridItem, ListEmptyComponent } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { TabsScrollView } from "app/wrappers"
import { Button, Flex, useSpace } from "palette"
import { extractNodes } from "shared/utils"

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

  const space = useSpace()

  return (
    <>
      <TabsScrollView>
        <MasonryList
          testID="artist-artwork-list"
          contentContainerStyle={{
            marginTop: artworks.length ? space(2) : 0,
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
          ListEmptyComponent={<ListEmptyComponent text="No artworks" />}
        />
      </TabsScrollView>
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
          <Button variant="fillGray" size="small" onPress={() => console.log("Select All")}>
            Select All
          </Button>
          <Button variant="fillGray" size="small" onPress={() => console.log("Cancel")}>
            Cancel
          </Button>
        </Flex>
      )}
      <Flex position="absolute" zIndex={100} bottom={50} width="100%" alignItems="center">
        <Button onPress={() => GlobalStore.actions.selectMode.toggleSelectMode()}>Select</Button>
      </Flex>
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
