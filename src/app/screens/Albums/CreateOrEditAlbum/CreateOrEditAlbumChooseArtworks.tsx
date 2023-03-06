import { Flex, Button, Text, useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { ArtistArtworksQuery } from "__generated__/ArtistArtworksQuery.graphql"
import { CreateOrEditAlbumChooseArtworksQuery } from "__generated__/CreateOrEditAlbumChooseArtworksQuery.graphql"
import { NavigationScreens } from "app/Navigation"
import { ArtworkGridItem } from "app/components/Items/ArtworkGridItem"
import { isAllSelected } from "app/components/SelectMode"
import { artistArtworksQuery } from "app/screens/Artists/ArtistTabs/ArtistArtworks/ArtistArtworks"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { usePresentationFilteredArtworks } from "app/utils/hooks/usePresentationFilteredArtworks"
import { imageSize } from "app/utils/imageSize"
import { differenceBy } from "lodash"
import { Screen } from "palette"
import { graphql } from "react-relay"

type CreateOrEditAlbumChooseArtworksRoute = RouteProp<
  NavigationScreens,
  "CreateOrEditAlbumChooseArtworks"
>

export const CreateOrEditAlbumChooseArtworks = () => {
  const { mode, slug, albumId } = useRoute<CreateOrEditAlbumChooseArtworksRoute>().params
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const partnerID = GlobalStore.useAppState((state) => state.auth.activePartnerID)!
  const artworksData = useSystemQueryLoader<ArtistArtworksQuery>(artistArtworksQuery, {
    partnerID,
    slug,
    imageSize,
  })
  const artworks = extractNodes(artworksData.partner?.artworksConnection)
  const artistNameData = useSystemQueryLoader<CreateOrEditAlbumChooseArtworksQuery>(
    artistNameQuery,
    {
      slug,
    }
  )

  const space = useSpace()

  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const album = albums.find((album) => album.id === albumId)

  const selectedItems = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.selectedItems
  )

  const presentedArtworks = usePresentationFilteredArtworks(artworks)

  const selectArtworksToAddToAnAlbum = () => {
    GlobalStore.actions.selectMode.cancelSelectMode()

    navigation.navigate("CreateOrEditAlbum", {
      mode,
      albumId,
      artworksToAdd: selectedItems,
    })
  }

  const allSelected = isAllSelected(selectedItems, presentedArtworks)

  return (
    <Screen>
      <Screen.Header
        title={mode === "edit" ? "Save to Album" : "Add to Album"}
        rightElements={
          <Button
            size="small"
            onPress={() => {
              if (allSelected) {
                GlobalStore.actions.selectMode.clearSelectedItems()
              } else {
                GlobalStore.actions.selectMode.selectItems(artworks)
              }
            }}
          >
            {selectedItems.length === artworks.length ? "Unselect All" : "Select All"}
          </Button>
        }
      />
      <Screen.Body>
        <MasonryList
          contentContainerStyle={{
            marginTop: space(2),
          }}
          numColumns={2}
          data={presentedArtworks}
          keyExtractor={(item) => item?.internalID}
          renderItem={({ item: artwork, i }) => {
            return (
              <ArtworkGridItem
                artwork={artwork}
                disable={!!album?.items?.find((item) => item?.internalID === artwork.internalID)}
                onPress={() => GlobalStore.actions.selectMode.toggleSelectedItem(artwork)}
                selectedToAdd={
                  !!selectedItems.find((item) => item?.internalID === artwork.internalID)
                }
                style={{
                  marginLeft: i % 2 === 0 ? 0 : space(1),
                  marginRight: i % 2 === 0 ? space(1) : 0,
                }}
              />
            )
          }}
        />
        <Flex pt={1}>
          <Text variant="xs" color="onBackgroundMedium" mb={1} textAlign="center">
            Selected artworks for {artistNameData.artist?.name}: {selectedItems.length}
          </Text>
          <Button block onPress={selectArtworksToAddToAnAlbum} disabled={selectedItems.length <= 0}>
            {mode === "edit" ? "Save" : "Add"}
          </Button>
        </Flex>
      </Screen.Body>
    </Screen>
  )
}

export const artistNameQuery = graphql`
  query CreateOrEditAlbumChooseArtworksQuery($slug: String!) {
    artist(id: $slug) {
      name
    }
  }
`
