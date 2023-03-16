import { Button, useSpace } from "@artsy/palette-mobile"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { Screen } from "components/Screen"
import { useState } from "react"
import { FlatList } from "react-native"
import { AlbumListItem } from "screens/Albums/AlbumTabs/AlbumListItem"
import { useNavigateToSavedHistory } from "system/hooks/useNavigationHistory"
import { GlobalStore } from "system/store/GlobalStore"

type HomeTabsRoute = RouteProp<NavigationScreens, "AddItemsToAlbum">

export const AddItemsToAlbum = () => {
  const { artworkToAdd, artworksToAdd } = useRoute<HomeTabsRoute>().params
  const space = useSpace()
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const { navigateToSavedHistory } = useNavigateToSavedHistory()

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
          // TODO: Pending design feedback
          // waitForScreenTransition(() => {
          //   toast.show({
          //     title: "Successfully added to album.",
          //     type: "success",
          //   })
          // })
        },
      })

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
            const selectedToAdd = selectedAlbumIds.includes(album.id)

            return (
              <AlbumListItem
                album={album}
                selectedToAdd={selectedToAdd}
                onPress={() => {
                  selectAlbumHandler(album.id)
                }}
              />
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
