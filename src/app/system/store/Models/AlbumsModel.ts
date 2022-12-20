import { action, Action } from "easy-peasy"
import { uniq } from "lodash"
import { DateTime } from "luxon"
import uuid from "react-native-uuid"

type ArtistSlug = string
type ArtworkId = string
type InstallShotUrl = string
type DocumentId = string
export interface Album {
  id: Readonly<string>
  name: string
  artworkIds: ArtworkId[]
  installShotUrls: InstallShotUrl[]
  documentIds: DocumentId[]
  createdAt: string
}

export interface AlbumsModel {
  sessionState: {
    selectedArtworksForNewAlbum: Record<ArtistSlug, ArtworkId[]>
    selectedArtworksForExistingAlbum: Record<ArtistSlug, ArtworkId[]>
  }
  albums: Album[]
  addAlbum: Action<
    this,
    {
      name: string
      artworkIds: ArtworkId[]
      installShotUrls: InstallShotUrl[]
      documentIds: DocumentId[]
    }
  >
  removeAlbum: Action<this, string>
  editAlbum: Action<this, { albumId: string; name: string; artworkIds: ArtworkId[] }>
  addItemsInAlbums: Action<
    this,
    {
      albumIds: string[]
      artworkIdsToAdd: ArtworkId[]
      installShotUrlsToAdd: InstallShotUrl[]
      documentIdsToAdd: DocumentId[]
    }
  >
  selectArtworksForNewAlbum: Action<this, { artistSlug: ArtistSlug; artworkIds: ArtworkId[] }>
  selectArtworksForExistingAlbum: Action<this, { artistSlug: ArtistSlug; artworkIds: ArtworkId[] }>
  clearSelectedArtworksForEditAlbum: Action<this>
}

export const getAlbumsModel = (): AlbumsModel => ({
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
  addItemsInAlbums: action(
    (
      state,
      { albumIds, artworkIdsToAdd = [], installShotUrlsToAdd = [], documentIdsToAdd = [] }
    ) => {
      albumIds.forEach((albumId) => {
        const index = state.albums.findIndex((x) => x.id === albumId)
        if (index !== -1) {
          state.albums[index].artworkIds = uniq([
            ...state.albums[index].artworkIds,
            ...artworkIdsToAdd,
          ])
          state.albums[index].installShotUrls = state.albums[index].installShotUrls
            ? uniq([...state.albums[index].installShotUrls, ...installShotUrlsToAdd])
            : installShotUrlsToAdd
          state.albums[index].documentIds = state.albums[index].documentIds
            ? uniq([...state.albums[index].documentIds, ...documentIdsToAdd])
            : documentIdsToAdd
        }
      })
    }
  ),
  selectArtworksForNewAlbum: action((state, { artistSlug, artworkIds }) => {
    state.sessionState.selectedArtworksForNewAlbum[artistSlug] = artworkIds
  }),
  selectArtworksForExistingAlbum: action((state, { artistSlug, artworkIds }) => {
    state.sessionState.selectedArtworksForExistingAlbum[artistSlug] = artworkIds
  }),
  clearSelectedArtworksForEditAlbum: action((state) => {
    state.sessionState.selectedArtworksForExistingAlbum = {}
  }),
})
