import { Button, useSpace, Screen } from "@artsy/palette-mobile"
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { useToast } from "components/Toast/ToastContext"
import { useState } from "react"
import { FlatList } from "react-native"
import { AlbumListItem } from "screens/Albums/AlbumTabs/AlbumListItem"
import { useAppTracking } from "system/hooks/useAppTracking"
import { useNavigateToSavedHistory } from "system/hooks/useNavigationHistory"
import { useTrackScreen } from "system/hooks/useTrackScreen"
import { GlobalStore } from "system/store/GlobalStore"
import { useIsDarkMode } from "utils/hooks/useIsDarkMode"
import { useSelectedItems } from "utils/hooks/useSelectedItems"
import { waitForScreenTransition } from "utils/waitForScreenTransition"

type HomeTabsRoute = RouteProp<NavigationScreens, "AddItemsToAlbum">

export const AddItemsToAlbum = () => {
  useTrackScreen({ name: "AddItemsToAlbum", type: "Album" })

  const { trackAddedToAlbum } = useAppTracking()
  const { artworksToAdd } = useRoute<HomeTabsRoute>().params
  const space = useSpace()
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const { navigateToSavedHistory } = useNavigateToSavedHistory()

  const [selectedAlbumIds, setSelectedAlbumIds] = useState<string[]>([])
  const isDarkMode = useIsDarkMode()
  const { toast } = useToast()

  const albums = GlobalStore.useAppState((state) => state.albums.albums)

  const isSelectModeActive = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.isActive
  )

  const { selectedItems } = useSelectedItems()

  const isAnalyticsVisualizerEnabled = GlobalStore.useAppState(
    (state) => state.artsyPrefs.isAnalyticsVisualizerEnabled
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
      } else if (artworksToAdd) {
        GlobalStore.actions.albums.addItemsToAlbums({
          albumIds: selectedAlbumIds,
          items: artworksToAdd,
        })
      }

      // Track new artwork additions
      selectedAlbumIds.forEach((albumId) => {
        const album = albums.find((album) => album.id === albumId)

        if (album) {
          trackAddedToAlbum(album)
        }
      })

      navigateToSavedHistory({
        lookupKey: "before-adding-to-album",

        onComplete: () => {
          waitForScreenTransition(() => {
            if (isAnalyticsVisualizerEnabled) {
              return
            }

            toast.show({
              title: "Successfully added to album.",
              type: "success",
            })
          })
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
        artworksToAdd,
      })
    }

    if (isSelectModeActive) {
      GlobalStore.actions.selectMode.cancelSelectMode()
    }
  }

  return (
    <Screen>
      <Screen.Header title="Add to Album" onBack={navigation.goBack} />
      <Screen.Body fullwidth>
        <FlatList
          data={albums}
          contentContainerStyle={{ paddingHorizontal: space(2) }}
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

        <Screen.BottomView darkMode={isDarkMode}>
          {selectedAlbumIds.length <= 0 ? (
            <Button
              block
              variant={isDarkMode ? "fillLight" : "fillDark"}
              onPress={createNewAlbumHandler}
            >
              Create New Album
            </Button>
          ) : (
            <Button
              block
              variant={isDarkMode ? "fillLight" : "fillDark"}
              onPress={addArtworkToSelectedAlbumsHandler}
            >
              Add
            </Button>
          )}
        </Screen.BottomView>
      </Screen.Body>
    </Screen>
  )
}
