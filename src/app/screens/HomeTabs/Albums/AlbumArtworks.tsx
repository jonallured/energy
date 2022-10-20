import { Flex, Touchable, TrashIcon, EditIcon, useSpace } from "@artsy/palette-mobile"
import { MasonryList } from "@react-native-seoul/masonry-list"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { Alert } from "react-native"
import { isTablet } from "react-native-device-info"
import { NavigationScreens } from "app/navigation/Main"
import { ArtworkItem, ListEmptyComponent } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { Screen } from "palette"

type AlbumArtworksRoute = RouteProp<NavigationScreens, "AlbumArtworks">

export const AlbumArtworks = () => {
  const { albumId } = useRoute<AlbumArtworksRoute>().params
  const navigation = useNavigation<NavigationProp<NavigationScreens>>()
  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const album = albums.find((album) => album.id === albumId)
  const space = useSpace()

  if (!album) {
    return <ListEmptyComponent />
  }

  const deleteAlbumHandler = () => {
    return Alert.alert(
      "Are you sure you want to delete this album?",
      "You cannot undo this action.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            GlobalStore.actions.albums.removeAlbum(album.id)
            navigation.goBack()
          },
        },
      ]
    )
  }

  const editAlbumHandler = () => {
    GlobalStore.actions.albums.clearSelectedArtworksForEditAlbum()
    navigation.navigate("CreateOrEditAlbum", { mode: "edit", albumId })
  }

  return (
    <Screen>
      <Screen.Header
        title={album.name}
        rightElements={
          <Flex flexDirection="row" alignItems="center">
            <Touchable onPress={deleteAlbumHandler} style={{ marginRight: space(2) }}>
              <TrashIcon fill="onBackgroundHigh" width={25} height={25} />
            </Touchable>
            <Touchable onPress={editAlbumHandler}>
              <EditIcon fill="onBackgroundHigh" width={25} height={25} />
            </Touchable>
          </Flex>
        }
      />
      <Screen.Body scroll>
        <MasonryList
          testID="artist-artwork-list"
          contentContainerStyle={{
            marginTop: space(2),
          }}
          numColumns={isTablet() ? 3 : 2}
          data={album.artworkIds ?? []}
          renderItem={({ item: artworkId, i }) => (
            <ArtworkItem
              artworkId={artworkId}
              style={{
                marginLeft: i % 2 === 0 ? 0 : space("1"),
                marginRight: i % 2 === 0 ? space("1") : 0,
              }}
            />
          )}
          keyExtractor={(item: string) => item}
        />
      </Screen.Body>
    </Screen>
  )
}
