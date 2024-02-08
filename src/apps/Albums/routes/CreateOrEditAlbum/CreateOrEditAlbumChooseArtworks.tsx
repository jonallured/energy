import { Screen, Button, Text, Spacer, useSpace } from "@artsy/palette-mobile"
import { RouteProp, useRoute } from "@react-navigation/native"
import { NavigationRoutes } from "Navigation"
import { ArtistArtworksQuery } from "__generated__/ArtistArtworksQuery.graphql"
import { artistArtworksQuery } from "apps/Artists/routes/ArtistTabs/ArtistArtworks"
import { ArtworksList } from "components/Lists/ArtworksList"
import { isAllSelected } from "components/SelectMode/SelectMode"
import { useRouter } from "system/hooks/useRouter"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { useSystemQueryLoader } from "system/relay/useSystemQueryLoader"
import { GlobalStore } from "system/store/GlobalStore"
import { extractNodes } from "utils/extractNodes"
import { useIsDarkMode } from "utils/hooks/useIsDarkMode"
import { usePresentationFilteredArtworks } from "utils/hooks/usePresentationFilteredArtworks"
import { useSelectedItems } from "utils/hooks/useSelectedItems"

type CreateOrEditAlbumChooseArtworksRoute = RouteProp<
  NavigationRoutes,
  "CreateOrEditAlbumChooseArtworks"
>

export const CreateOrEditAlbumChooseArtworks = () => {
  useTrackScreen({ name: "CreateOrEditAlbumChooseArtworks", type: "Artwork" })

  const { mode, slug, albumId } =
    useRoute<CreateOrEditAlbumChooseArtworksRoute>().params
  const space = useSpace()
  const { router } = useRouter()
  const isDarkMode = useIsDarkMode()
  const partnerID = GlobalStore.useAppState(
    (state) => state.auth.activePartnerID
  )!
  const { data } = useSystemQueryLoader<ArtistArtworksQuery>(
    artistArtworksQuery,
    {
      partnerID,
      slug,
    }
  )

  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const album = albums.find((album) => album.id === albumId)

  const { selectedItems } = useSelectedItems()

  const presentedArtworks = usePresentationFilteredArtworks(
    extractNodes(data.partner?.artworksConnection)
  )

  const selectArtworksToAddToAnAlbum = () => {
    GlobalStore.actions.selectMode.cancelSelectMode()

    router.navigate("CreateOrEditAlbum", {
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
        onBack={() => {
          GlobalStore.actions.selectMode.clearSelectedItems()
          router.goBack()
        }}
        rightElements={
          <Button
            variant={isDarkMode ? "outlineLight" : "fillGray"}
            size="small"
            mt={0.5}
            onPress={() => {
              if (allSelected) {
                GlobalStore.actions.selectMode.clearSelectedItems()
              } else {
                GlobalStore.actions.selectMode.selectItems(presentedArtworks)
              }
            }}
          >
            {selectedItems.length === presentedArtworks.length
              ? "Unselect All"
              : "Select All"}
          </Button>
        }
      />

      <Spacer y={1} />

      <Screen.Body fullwidth>
        <ArtworksList
          contentContainerStyle={{ paddingHorizontal: space(2) }}
          artworks={presentedArtworks}
          checkIfDisabled={(item) => {
            return !!album?.items?.find(
              (albumItem) => albumItem?.internalID === item.internalID
            )
          }}
          onItemPress={(item) => {
            GlobalStore.actions.selectMode.toggleSelectedItem(item)
          }}
        />

        <Screen.BottomView darkMode={isDarkMode}>
          <Text
            variant="xs"
            color="onBackgroundMedium"
            mb={1}
            textAlign="center"
          >
            Selected artworks for{" "}
            {presentedArtworks[0]?.artistNames ?? "Artist"}:{" "}
            {selectedItems.length}
          </Text>

          <Button
            block
            variant={isDarkMode ? "fillLight" : "fillDark"}
            onPress={selectArtworksToAddToAnAlbum}
            disabled={selectedItems.length <= 0}
          >
            {mode === "edit" ? "Save" : "Add"}
          </Button>
        </Screen.BottomView>
      </Screen.Body>
    </Screen>
  )
}
