import { GlobalStore } from "system/store/GlobalStore"
import { Album } from "system/store/Models/AlbumsModel"
import { SelectedItemArtwork } from "system/store/Models/SelectModeModel"
import { usePresentationFilteredArtworks } from "utils/hooks/usePresentationFilteredArtworks"

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
