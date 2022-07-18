import { GlobalStore } from "app/store/GlobalStore"
import { AlbumsModel } from "app/store/Models/AlbumsModel"

const getSelectedArtworksFromAlbum = (type: keyof AlbumsModel["sessionState"], slug?: string) => {
  const artworks = GlobalStore.useAppState((state) => state.albums.sessionState[type])

  if (slug) {
    return artworks[slug]
  }

  return Object.values(artworks).flat()
}

export const useArtworksByMode = (mode: "create" | "edit", slug?: string) => {
  if (mode === "edit") {
    return getSelectedArtworksFromAlbum("selectedArtworksForExistingAlbum", slug)
  } else {
    return getSelectedArtworksFromAlbum("selectedArtworksForNewAlbum", slug)
  }
}
