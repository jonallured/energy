import { Button, Text } from "@artsy/palette-mobile"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { ArtistArtworksQuery } from "__generated__/ArtistArtworksQuery.graphql"
import { ArtworksList } from "components/Lists/ArtworksList"
import { Screen } from "components/Screen"
import { isAllSelected } from "components/SelectMode"
import { artistArtworksQuery } from "screens/Artists/ArtistTabs/ArtistArtworks"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { GlobalStore } from "system/store/GlobalStore"
import { extractNodes } from "utils/extractNodes"
import { usePresentationFilteredArtworks } from "utils/hooks/usePresentationFilteredArtworks"

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
  })

  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const album = albums.find((album) => album.id === albumId)

  const selectedItems = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.selectedItems
  )

  const presentedArtworks = usePresentationFilteredArtworks(
    extractNodes(artworksData.partner?.artworksConnection)
  )

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
                GlobalStore.actions.selectMode.selectItems(presentedArtworks)
              }
            }}
          >
            {selectedItems.length === presentedArtworks.length ? "Unselect All" : "Select All"}
          </Button>
        }
      />

      <Screen.Body fullwidth>
        <ArtworksList
          artworks={presentedArtworks}
          checkIfDisabled={(item) => {
            return !!album?.items?.find((albumItem) => albumItem?.internalID === item.internalID)
          }}
          onItemPress={(item) => {
            GlobalStore.actions.selectMode.toggleSelectedItem(item)
          }}
        />

        <Screen.BottomView>
          <Text variant="xs" color="onBackgroundMedium" mb={1} textAlign="center">
            Selected artworks for {presentedArtworks[0]?.artistNames ?? "Artist"}:{" "}
            {selectedItems.length}
          </Text>

          <Button block onPress={selectArtworksToAddToAnAlbum} disabled={selectedItems.length <= 0}>
            {mode === "edit" ? "Save" : "Add"}
          </Button>
        </Screen.BottomView>
      </Screen.Body>
    </Screen>
  )
}