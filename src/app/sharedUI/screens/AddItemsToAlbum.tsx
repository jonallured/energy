import { Button, CheckCircleFillIcon, Flex, Touchable, useSpace } from "@artsy/palette-mobile"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { useState } from "react"
import { FlatList } from "react-native-gesture-handler"
import { NavigationScreens } from "app/navigation/Main"
import { useNavigationSavedForKey } from "app/navigation/navAtoms"
import { AlbumListItem } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { Screen } from "palette"

type HomeTabsRoute = RouteProp<NavigationScreens, "AddItemsToAlbum">

export const AddItemsToAlbum = () => {
  const { closeBottomSheetModal, artworkIdToAdd } = useRoute<HomeTabsRoute>().params

  const [hasSavedNav, navigateToSaved] = useNavigationSavedForKey("before-adding-to-album")
  const isSelectModeActive = GlobalStore.useAppState((state) => state.selectMode.isActive)
  const selectedArtworks = GlobalStore.useAppState((state) => state.selectMode.artworks)
  const selectedInstalls = GlobalStore.useAppState((state) => state.selectMode.installs)
  const selectedDocuments = GlobalStore.useAppState((state) => state.selectMode.documents)

  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const [selectedAlbumIds, setSelectedAlbumIds] = useState<string[]>([])
  const space = useSpace()

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
        GlobalStore.actions.albums.addItemsInAlbums({
          albumIds: selectedAlbumIds,
          artworkIdsToAdd: selectedArtworks,
          installShotUrlsToAdd: selectedInstalls,
          documentIdsToAdd: selectedDocuments,
        })
      } else if (artworkIdToAdd !== undefined) {
        GlobalStore.actions.albums.addItemsInAlbums({
          albumIds: selectedAlbumIds,
          artworkIdsToAdd: [artworkIdToAdd],
          installShotUrlsToAdd: [],
          documentIdsToAdd: [],
        })
      }
      hasSavedNav ? navigateToSaved() : navigation.goBack()
      closeBottomSheetModal?.()
      if (isSelectModeActive) {
        GlobalStore.actions.selectMode.cancelSelectMode()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const renderButton = () => {
    if (selectedAlbumIds.length <= 0) {
      return (
        <Button
          block
          onPress={() => {
            navigation.navigate("CreateOrEditAlbum", {
              mode: "create",
              artworkIdToAdd,
              closeBottomSheetModal,
            })
          }}
        >
          Create New Album
        </Button>
      )
    }
    return (
      <Button block onPress={addArtworkToTheSelectedAlbums}>
        Add
      </Button>
    )
  }

  return (
    <Screen>
      <Screen.Header title="Add to Album" />
      <Screen.Body fullwidth>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: space("2") }}
          data={albums}
          keyExtractor={(item) => item?.id}
          renderItem={({ item: album }) => {
            return (
              <Flex key={album.id}>
                <Touchable onPress={() => selectAlbumHandler(album.id)}>
                  <Flex mb={3} mt={1}>
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
          style={{
            top: space(2),
            marginBottom: space(12),
          }}
        />

        <Screen.BottomView>{renderButton()}</Screen.BottomView>
      </Screen.Body>
    </Screen>
  )
}
