import { Button, CheckCircleFillIcon, Flex, Touchable, useSpace } from "@artsy/palette-mobile"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { Screen } from "components/Screen"
import { useScreenBottomViewHeight } from "components/Screen/atoms"
import { useState } from "react"
import { FlatList } from "react-native"
import { AlbumListItem } from "screens/Albums/AlbumTabs/AlbumListItem"
import { useNavigationSavedForKey } from "system/hooks/useNavigationSave"
import { GlobalStore } from "system/store/GlobalStore"

type HomeTabsRoute = RouteProp<NavigationScreens, "AddItemsToAlbum">

export const AddItemsToAlbum = () => {
  const { closeBottomSheetModal, artworkToAdd, artworksToAdd } = useRoute<HomeTabsRoute>().params
  const bottomViewHeight = useScreenBottomViewHeight()
  const space = useSpace()
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const [hasSavedNav, navigateToSaved] = useNavigationSavedForKey("before-adding-to-album")

  const [selectedAlbumIds, setSelectedAlbumIds] = useState<string[]>([])

  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const isSelectModeActive = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.isActive
  )
  const selectedItems = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.selectedItems
  )

  const selectAlbumHandler = (albumId: string) => {
    if (!selectedAlbumIds.includes(albumId)) {
      setSelectedAlbumIds([...selectedAlbumIds, albumId])
    } else {
      const unselectedAlbumIds = selectedAlbumIds.filter((id) => id !== albumId)
      setSelectedAlbumIds(unselectedAlbumIds)
    }
  }

  const addArtworkToTheSelectedAlbums = () => {
    try {
      if (isSelectModeActive) {
        GlobalStore.actions.albums.addItemsToAlbums({
          albumIds: selectedAlbumIds,
          items: selectedItems,
        })
      } else if (artworkToAdd !== undefined) {
        GlobalStore.actions.albums.addItemsToAlbums({
          albumIds: selectedAlbumIds,
          items: [artworkToAdd],
        })
      }

      if (hasSavedNav) {
        navigateToSaved()
      } else {
        navigation.goBack()
      }

      closeBottomSheetModal?.()

      if (isSelectModeActive) {
        GlobalStore.actions.selectMode.cancelSelectMode()
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Screen>
      <Screen.Header title="Add to Album" />
      <Screen.Body fullwidth>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: space(2) }}
          data={albums}
          keyExtractor={(item) => item?.id}
          renderItem={({ item: album }) => {
            return (
              <Flex key={album.id}>
                <Touchable onPress={() => selectAlbumHandler(album.id)}>
                  <Flex mb={4} mt={1}>
                    <AlbumListItem album={album} />
                  </Flex>
                  {selectedAlbumIds.includes(album.id) && (
                    <Flex
                      position="absolute"
                      top={2}
                      right={1}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <CheckCircleFillIcon height={30} width={30} fill="blue100" />
                    </Flex>
                  )}
                </Touchable>
              </Flex>
            )
          }}
          style={{ top: space(2), marginBottom: bottomViewHeight }}
        />

        <Screen.BottomView>
          {selectedAlbumIds.length <= 0 ? (
            <Button
              block
              onPress={() => {
                GlobalStore.actions.selectMode.cancelSelectMode()

                navigation.navigate("CreateOrEditAlbum", {
                  mode: "create",
                  artworksToAdd: artworksToAdd! ?? [artworkToAdd],
                  closeBottomSheetModal,
                })
              }}
            >
              Create New Album
            </Button>
          ) : (
            <Button block onPress={addArtworkToTheSelectedAlbums}>
              Add
            </Button>
          )}
        </Screen.BottomView>
      </Screen.Body>
    </Screen>
  )
}
