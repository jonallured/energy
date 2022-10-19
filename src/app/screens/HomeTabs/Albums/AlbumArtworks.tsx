import { MasonryList } from "@react-native-seoul/masonry-list"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { Alert } from "react-native"
import { HomeTabsScreens } from "app/navigation/HomeTabsNavigationStack"
import { Header, ArtworkItem, ListEmptyComponent } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { Flex, Touchable, TrashIcon, EditIcon, useSpace } from "palette"

type AlbumArtworksRoute = RouteProp<HomeTabsScreens, "AlbumArtworks">

export const AlbumArtworks = () => {
  const { albumId } = useRoute<AlbumArtworksRoute>().params
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
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
    <>
      <Header
        label={album.name}
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
        safeAreaInsets
      />
      <MasonryList
        testID="artist-artwork-list"
        contentContainerStyle={{
          paddingRight: space(2),
          marginTop: space(2),
        }}
        numColumns={2}
        data={album.artworkIds!}
        renderItem={({ item: artworkId }) => <ArtworkItem artworkId={artworkId} />}
        keyExtractor={(item: string) => item}
      />
    </>
  )
}
