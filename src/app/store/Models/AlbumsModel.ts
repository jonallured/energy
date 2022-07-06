import { action, Action } from "easy-peasy"
import _ from "lodash"

export interface Album {
  id: Readonly<string>
  title: string
  artworkIds: string[]
  createdAt: string
}
export interface AlbumsModel {
  sessionState: {
    selectedArtworks: string[]
  }
  albums: Album[]
  addAlbum: Action<this, Album>
  removeAlbum: Action<this, string>
  addArtworksInAlbums: Action<this, { albumIds: string[]; artworkIdsToAdd: string[] }>
  removeArtworksFromAlbums: Action<this, { albumIds: string[]; artworkIdsToRemove: string[] }>
  selectArtworksForANewAlbum: Action<this, this["sessionState"]["selectedArtworks"]>
  clearAllSelectedArtworks: Action<this>
}

export const AlbumsModel: AlbumsModel = {
  sessionState: {
    selectedArtworks: [],
  },
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
  selectArtworksForANewAlbum: action((state, uncommittedArtworkIds) => {
    state.sessionState.selectedArtworks.push(...uncommittedArtworkIds)
    state.sessionState.selectedArtworks = _.uniq(state.sessionState.selectedArtworks)
  }),

  clearAllSelectedArtworks: action((state) => {
    state.sessionState.selectedArtworks = []
  }),
}
