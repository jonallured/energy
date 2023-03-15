import { Button, CheckCircleFillIcon, Flex, Touchable, useSpace } from "@artsy/palette-mobile"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { Screen } from "components/Screen"
import { useToast } from "components/Toast/ToastContext"
import { useState } from "react"
import { FlatList } from "react-native"
import { AlbumListItem } from "screens/Albums/AlbumTabs/AlbumListItem"
import { useNavigateToSavedHistory } from "system/hooks/useNavigationHistory"
import { GlobalStore } from "system/store/GlobalStore"

type HomeTabsRoute = RouteProp<NavigationScreens, "AddItemsToAlbum">

export const AddItemsToAlbum = () => {
  const { closeBottomSheetModal, artworkToAdd, artworksToAdd } = useRoute<HomeTabsRoute>().params
  const space = useSpace()
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const { navigateToSavedHistory } = useNavigateToSavedHistory()
  const { toast } = useToast()

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

  const addArtworkToSelectedAlbumsHandler = () => {
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

      navigateToSavedHistory({
        lookupKey: "before-adding-to-album",
        onComplete: () => {
          toast.show({
            title: "Successfully added to album.",
            type: "success",
            onPress: () => {
              console.log("hiii")
            },
          })
        },
      })
      closeBottomSheetModal?.()

      if (isSelectModeActive) {
        GlobalStore.actions.selectMode.cancelSelectMode()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const createNewAlbumHandler = () => {
    if (artworksToAdd) {
      navigation.navigate("CreateOrEditAlbum", {
        mode: "create",
        artworksToAdd: artworksToAdd ?? [artworkToAdd],
        closeBottomSheetModal,
      })
    }

    if (isSelectModeActive) {
      GlobalStore.actions.selectMode.cancelSelectMode()
    }
  }

  return (
    <Screen>
      <Screen.Header title="Add to Album" />
      <Screen.Body>
        <FlatList
          data={albums}
          keyExtractor={(item) => item?.id}
          renderItem={({ item: album }) => {
            return (
              <Flex key={album.id}>
                <Touchable onPress={() => selectAlbumHandler(album.id)}>
                  <AlbumListItem album={album} />

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
          style={{ top: space(2) }}
        />

        <Screen.BottomView>
          {selectedAlbumIds.length <= 0 ? (
            <Button block onPress={createNewAlbumHandler}>
              Create New Album
            </Button>
          ) : (
            <Button block onPress={addArtworkToSelectedAlbumsHandler}>
              Add
            </Button>
          )}
        </Screen.BottomView>
      </Screen.Body>
    </Screen>
  )
}
