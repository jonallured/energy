import { action, Action } from "easy-peasy"
import { uniq } from "lodash"
import uuid from "react-native-uuid"
import { DateTime } from "luxon"

export interface Album {
  id: Readonly<string>
  name: string
  artworkIds: string[]
  createdAt: string
}

type ArtistSlug = string
type ArtworkId = string
export interface AlbumsModel {
  sessionState: {
    selectedArtworksForNewAlbum: Record<ArtistSlug, ArtworkId[]>
    selectedArtworksForExistingAlbum: Record<ArtistSlug, ArtworkId[]>
  }
  albums: Album[]
  addAlbum: Action<this, { name: string; artworkIds: ArtworkId[] }>
  removeAlbum: Action<this, string>
  editAlbum: Action<this, { albumId: string; name: string; artworkIds: ArtworkId[] }>
  addArtworksInAlbums: Action<this, { albumIds: string[]; artworkIdsToAdd: ArtworkId[] }>
  selectArtworksForNewAlbum: Action<this, { artistSlug: ArtistSlug; artworkIds: ArtworkId[] }>
  selectArtworksForExistingAlbum: Action<this, { artistSlug: ArtistSlug; artworkIds: ArtworkId[] }>
  clearSelectedArtworksForEditAlbum: Action<this>
}

export const AlbumsModel: AlbumsModel = {
  sessionState: {
    selectedArtworksForNewAlbum: {},
    selectedArtworksForExistingAlbum: {},
  },
  albums: [],
  addAlbum: action((state, album) => {
    const id = uuid.v4().toString()
    const createdAt = DateTime.now().toISO()
    state.albums.push({
      id,
      createdAt,
      ...album,
    })
    state.sessionState.selectedArtworksForNewAlbum = {}
  }),
  removeAlbum: action((state, albumId) => {
    state.albums = state.albums.filter((x) => x.id !== albumId)
  }),
  editAlbum: action((state, { albumId, name, artworkIds }) => {
    const index = state.albums.findIndex((x) => x.id === albumId)
    if (index === -1) {
      throw new Error("Album not found")
    }
    state.albums[index].name = name
    state.albums[index].artworkIds = artworkIds
    state.sessionState.selectedArtworksForExistingAlbum = {}
  }),
  addArtworksInAlbums: action((state, { albumIds, artworkIdsToAdd }) => {
    albumIds.forEach((albumId) => {
      const index = state.albums.findIndex((x) => x.id === albumId)
      if (index !== -1) {
        state.albums[index].artworkIds = uniq([
          ...state.albums[index].artworkIds,
          ...artworkIdsToAdd,
        ])
      }
    })
  }),
  selectArtworksForNewAlbum: action((state, { artistSlug, artworkIds }) => {
    state.sessionState.selectedArtworksForNewAlbum[artistSlug] = artworkIds
  }),
  selectArtworksForExistingAlbum: action((state, { artistSlug, artworkIds }) => {
    state.sessionState.selectedArtworksForExistingAlbum[artistSlug] = artworkIds
  }),
  clearSelectedArtworksForEditAlbum: action((state) => {
    state.sessionState.selectedArtworksForExistingAlbum = {}
  }),
}
