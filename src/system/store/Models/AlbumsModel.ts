import { action, Action } from "easy-peasy"
import { uniqBy } from "lodash"
import { DateTime } from "luxon"
import uuid from "react-native-uuid"
import { SelectedItem } from "system/store/Models/SelectModeModel"

export interface Album {
  id: Readonly<string>
  name: string
  items: SelectedItem[]
  createdAt: string
}

export interface AlbumsModel {
  sessionState: {
    queuedItemsToAdd: SelectedItem[]
  }
  albums: Album[]
  addAlbum: Action<
    this,
    {
      name: string
      items: SelectedItem[]
    }
  >
  queueItemsToAdd: Action<
    this,
    { items?: SelectedItem[]; album?: Album | null | undefined }
  >
  clearItemQueue: Action<this>
  removeAlbum: Action<this, string>
  editAlbum: Action<
    this,
    {
      albumId: string
      name: string
      items: SelectedItem[]
    }
  >
  addItemsToAlbums: Action<
    this,
    {
      albumIds: string[]
      items: SelectedItem[]
    }
  >

  removeItemFromAlbums: Action<this, string>
}

export const getAlbumsModel = (): AlbumsModel => ({
  sessionState: {
    queuedItemsToAdd: [],
  },

  albums: [],

  addAlbum: action((state, album) => {
    const id = uuid.v4().toString()
    const createdAt = DateTime.now().toISO()
    const newAlbum = {
      id,
      createdAt,
      ...album,
    }
    state.albums.push(newAlbum)
  }),

  queueItemsToAdd: action((state, { items, album }) => {
    const albumItems = album?.items ?? []

    // Selecting multiple artworks from choose artworks screen
    if (items) {
      state.sessionState.queuedItemsToAdd = uniqBy(
        [...items, ...albumItems, ...state.sessionState.queuedItemsToAdd],
        "internalID"
      )
    } else {
      state.sessionState.queuedItemsToAdd = albumItems
    }
  }),

  clearItemQueue: action((state) => {
    state.sessionState.queuedItemsToAdd = []
  }),

  removeAlbum: action((state, albumId) => {
    state.albums = state.albums.filter((x) => x.id !== albumId)
  }),

  // TODO: listen for this and deselect
  editAlbum: action((state, { albumId, name, items }) => {
    const index = state.albums.findIndex((x) => x.id === albumId)
    if (index === -1) {
      throw new Error("Album not found")
    }
    state.albums[index].name = name
    state.albums[index].items = items
  }),

  addItemsToAlbums: action((state, { albumIds, items = [] }) => {
    albumIds.forEach((albumId) => {
      const index = state.albums.findIndex((x) => x.id === albumId)
      if (index !== -1) {
        state.albums[index].items = uniqBy(
          [...state.albums[index].items, ...items],
          "internalID"
        )
      }
    })
  }),

  removeItemFromAlbums: action((state, internalID) => {
    state.albums.forEach((album) => {
      album.items = album.items.filter(
        (item) => item?.internalID !== internalID
      )
    })
  }),
})
