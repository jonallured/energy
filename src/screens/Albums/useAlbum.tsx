import { filter } from "lodash"
import { GlobalStore } from "system/store/GlobalStore"
import { Album } from "system/store/Models/AlbumsModel"
import {
  SelectedItemArtwork,
  SelectedItemDocument,
  SelectedItemInstall,
} from "system/store/Models/SelectModeModel"
import { usePresentationFilteredArtworks } from "utils/hooks/usePresentationFilteredArtworks"

interface UseAlbumProps {
  albumId: string
}

interface UseAlbumReturnType {
  album: Album | null | undefined
  artworks: SelectedItemArtwork[]
  documents: SelectedItemDocument[]
  installs: SelectedItemInstall[]
}

export const useAlbum = ({ albumId }: UseAlbumProps): UseAlbumReturnType => {
  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const album = albums.find((album) => album.id === albumId)
  const items = album?.items ?? []

  const artworks = usePresentationFilteredArtworks(
    filter(items, { __typename: "Artwork" }) as SelectedItemArtwork[]
  )
  const documents = filter(items, {
    __typename: "PartnerDocument",
  }) as SelectedItemDocument[]
  const installs = filter(items, {
    __typename: "Image",
  }) as SelectedItemInstall[]

  return {
    album,
    artworks,
    documents,
    installs,
  }
}
