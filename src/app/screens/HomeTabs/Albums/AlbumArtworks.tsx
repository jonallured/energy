import MasonryList from "@react-native-seoul/masonry-list"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"
import { Header, ArtworkItem, ListEmptyComponent } from "app/sharedUI"
import { GlobalStore } from "app/store/GlobalStore"
import { Flex, Touchable, TrashIcon } from "palette"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Alert } from "react-native"

type AlbumArtworksRoute = RouteProp<HomeTabsScreens, "AlbumArtworks">

export const AlbumArtworks = () => {
  const { albumId } = useRoute<AlbumArtworksRoute>().params
  const navigation = useNavigation<NavigationProp<HomeTabsScreens>>()
  const safeAreaInsets = useSafeAreaInsets()
  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const album = albums.find((album) => album.id === albumId)

  if (!album) {
    return <ListEmptyComponent />
  }

  const deleteAlbumHandler = () =>
    Alert.alert("Are you sure you want to delete this album?", "You cannot undo this action", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await GlobalStore.actions.albums.removeAlbum(album.id)
          navigation.goBack()
        },
      },
    ])

  return (
    <Flex flex={1} pt={safeAreaInsets.top}>
      <Header
        label={album.title}
        rightElements={
          <Flex alignItems="center">
            <Touchable onPress={deleteAlbumHandler}>
              <TrashIcon fill="black100" width={25} height={25} />
            </Touchable>
          </Flex>
        }
      />
      <MasonryList
        testID="artist-artwork-list"
        contentContainerStyle={{
          paddingRight: 20,
          marginTop: 20,
        }}
        numColumns={2}
        data={album.artworkIds}
        renderItem={({ item: artworkId }) => <ArtworkItem artworkId={artworkId} />}
        keyExtractor={(item) => item}
      />
    </Flex>
  )
}
