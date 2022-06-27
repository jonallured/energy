import { action, Action } from "easy-peasy"

export interface Album {
  id: Readonly<string>
  title: string
  artworkIds: string[]
  createdAt: string
}

export interface AlbumsModel {
  albums: Album[]
  addAlbum: Action<this, Album>
  removeAlbum: Action<this, string>
  addArtworksInAlbums: Action<this, { albumIds: string[]; artworkIdsToAdd: string[] }>
  removeArtworksFromAlbums: Action<this, { albumIds: string[]; artworkIdsToRemove: string[] }>
}

export const AlbumsModel: AlbumsModel = {
  albums: [],
  addAlbum: action((state, album) => {
    state.albums.push(album)
  }),
  removeAlbum: action((state, albumId) => {
    state.albums = state.albums.filter((x) => x.id !== albumId)
  }),
  addArtworksInAlbums: action((state, { albumIds, artworkIdsToAdd }) => {
    albumIds.forEach((albumId) => {
      const index = state.albums.findIndex((x) => x.id === albumId)
      state.albums[index].artworkIds = [...state.albums[index].artworkIds, ...artworkIdsToAdd]
    })
  }),
  removeArtworksFromAlbums: action((state, { albumIds, artworkIdsToRemove }) => {
    albumIds.forEach((albumId) => {
      const index = state.albums.findIndex((x) => x.id === albumId)
      state.albums[index].artworkIds = state.albums[index].artworkIds.filter(
        (id) => !artworkIdsToRemove.includes(id)
      )
    })
  }),
}
