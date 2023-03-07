import { GlobalStore } from "app/system/store/GlobalStore"
import { Album } from "app/system/store/Models/AlbumsModel"
import { SelectedItemArtwork } from "app/system/store/Models/SelectModeModel"
import { usePresentationFilteredArtworks } from "app/utils/hooks/usePresentationFilteredArtworks"

interface useAlbumProps {
  albumId: string
}

export const useAlbum = ({
  albumId,
}: useAlbumProps): { album: Album | null | undefined; artworks: SelectedItemArtwork[] } => {
  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const album = albums.find((album) => album.id === albumId)
  const artworks = usePresentationFilteredArtworks((album?.items ?? []) as SelectedItemArtwork[])

  return {
    album,
    artworks,
  }
}
