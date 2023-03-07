import { Flex, Button, Text } from "@artsy/palette-mobile"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { ArtistArtworksQuery } from "__generated__/ArtistArtworksQuery.graphql"
import { NavigationScreens } from "app/Navigation"
import { ArtworksList } from "app/components/Lists/ArtworksList"
import { isAllSelected } from "app/components/SelectMode"
import { artistArtworksQuery } from "app/screens/Artists/ArtistTabs/ArtistArtworks"
import { useSystemQueryLoader } from "app/system/relay/useSystemQueryLoader"
import { GlobalStore } from "app/system/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { usePresentationFilteredArtworks } from "app/utils/hooks/usePresentationFilteredArtworks"
import { Screen } from "palette"

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

      <Screen.Body>
        <ArtworksList
          artworks={presentedArtworks}
          checkIfDisabled={(item) => {
            return !!album?.items?.find((albumItem) => albumItem?.internalID === item.internalID)
          }}
          onItemPress={(item) => {
            GlobalStore.actions.selectMode.toggleSelectedItem(item)
          }}
        />

        <Flex pt={1}>
          <Text variant="xs" color="onBackgroundMedium" mb={1} textAlign="center">
            Selected artworks for {presentedArtworks[0].artistNames}: {selectedItems.length}
          </Text>

          <Button block onPress={selectArtworksToAddToAnAlbum} disabled={selectedItems.length <= 0}>
            {mode === "edit" ? "Save" : "Add"}
          </Button>
        </Flex>
      </Screen.Body>
    </Screen>
  )
}
