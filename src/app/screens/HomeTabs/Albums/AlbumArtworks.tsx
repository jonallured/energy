import MasonryList from "@react-native-seoul/masonry-list"
import { RouteProp, useRoute } from "@react-navigation/native"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"
import { Header } from "app/sharedUI/Header"
import { GlobalStore } from "app/store/GlobalStore"
import { ArtworkItem } from "app/sharedUI/items/ArtworkItem"

type AlbumArtworksRoute = RouteProp<HomeTabsScreens, "AlbumArtworks">

export const AlbumArtworks = () => {
  const { albumId } = useRoute<AlbumArtworksRoute>().params
  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const album = albums.find((album) => album.id === albumId)

  return (
    <MasonryList
      testID="artist-artwork-list"
      contentContainerStyle={{ paddingRight: 20 }}
      ListHeaderComponent={<Header label={album?.title || ""} />}
      ListHeaderComponentStyle={{ marginTop: 20, marginBottom: 20 }}
      numColumns={2}
      data={album?.artworkIds || []}
      renderItem={({ item: artworkId }) => <ArtworkItem artworkId={artworkId} />}
      keyExtractor={(item) => item}
    />
  )
}
