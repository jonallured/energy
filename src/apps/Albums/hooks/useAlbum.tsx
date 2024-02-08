import {
  AlbumEditMode,
  CreateAlbumValuesSchema,
} from "apps/Albums/routes/CreateOrEditAlbum/CreateOrEditAlbum"
import { differenceBy, filter } from "lodash"
import { useAppTracking } from "system/hooks/useAppTracking"
import { GlobalStore } from "system/store/GlobalStore"
import { Album } from "system/store/Models/AlbumsModel"
import {
  SelectedItemArtwork,
  SelectedItemDocument,
  SelectedItemInstall,
} from "system/store/Models/SelectModeModel"
import { usePresentationFilteredArtworks } from "utils/hooks/usePresentationFilteredArtworks"
import { useSelectedItems } from "utils/hooks/useSelectedItems"

interface UseAlbumProps {
  albumId: string | null
}

interface SaveAlbumProps {
  mode: AlbumEditMode
  values: CreateAlbumValuesSchema
}

interface UseAlbumReturnType {
  album: Album | null | undefined
  artworks: SelectedItemArtwork[]
  documents: SelectedItemDocument[]
  installs: SelectedItemInstall[]
  saveAlbum: (props: SaveAlbumProps) => void
}

export const useAlbum = ({ albumId }: UseAlbumProps): UseAlbumReturnType => {
  const { trackCreatedAlbum } = useAppTracking()
  const { selectedItems } = useSelectedItems()

  const albums = GlobalStore.useAppState((state) => state.albums.albums)
  const queuedArtworksToAdd = GlobalStore.useAppState(
    (state) => state.albums.sessionState.itemQueue
  )

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

  const saveAlbum = ({ mode, values }: SaveAlbumProps) => {
    /**
     * Take the new items to add and subtract items to delete (aka `selectedItems`)
     * and return the final result to save.
     */
    const items = differenceBy(queuedArtworksToAdd, selectedItems, "internalID")

    if (mode === "create") {
      GlobalStore.actions.albums.addAlbum({
        name: values.albumName.trim(),
        items,
      })

      trackCreatedAlbum()
    }

    if (mode === "edit") {
      GlobalStore.actions.albums.editAlbum({
        albumId: albumId as string,
        name: values.albumName,
        items,
      })
    }
  }

  return {
    album,
    artworks,
    documents,
    installs,
    saveAlbum,
  }
}
