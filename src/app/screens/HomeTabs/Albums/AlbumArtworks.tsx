import { graphql, useLazyLoadQuery } from "react-relay"
import MasonryList from "@react-native-seoul/masonry-list"
import { Header, ArtworkGridItem } from "app/sharedUI"
import { RouteProp, useRoute } from "@react-navigation/native"
import { HomeTabsScreens } from "app/routes/HomeTabsNavigationStack"
import { SuspenseWrapper } from "app/wrappers"
import { GlobalStore } from "app/store/GlobalStore"
import { AlbumArtworksQuery } from "__generated__/AlbumArtworksQuery.graphql"

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
      renderItem={({ item: artworkId }) => <ArtworkItemWrapper artworkId={artworkId} />}
      keyExtractor={(item) => item.internalID!}
    />
  )
}

const ArtworkItemWrapper = ({ artworkId }: { artworkId: string }) => {
  return (
    <SuspenseWrapper>
      <ArtworkItem artworkId={artworkId} />
    </SuspenseWrapper>
  )
}

const ArtworkItem = ({ artworkId }: { artworkId: string }) => {
  const artworkData = useLazyLoadQuery<AlbumArtworksQuery>(albumArtworksQuery, { id: artworkId })
  return <ArtworkGridItem artwork={artworkData.artwork!} />
}

const albumArtworksQuery = graphql`
  query AlbumArtworksQuery($id: String!) {
    artwork(id: $id) {
      ...ArtworkGridItem_artwork
    }
  }
`
