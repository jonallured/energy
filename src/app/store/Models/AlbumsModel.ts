import { action, Action } from "easy-peasy"

interface Album {
  id: Readonly<string>
  title: string
  artworkIds: string[]
  createdAt: string
}

export interface AlbumsModel {
  albums: Album[]
  addAlbum: Action<this, Album>
  updateAlbum: Action<this, Album>
  removeAlbum: Action<this, string>
}

export const AlbumsModel: AlbumsModel = {
  albums: [],
  addAlbum: action((state, album) => {
    state.albums.push(album)
  }),
  updateAlbum: action((state, album) => {
    const index = state.albums.findIndex((x) => x.id == album.id)
    state.albums[index] = album
  }),
  removeAlbum: action((state, albumId) => {
    state.albums = state.albums.filter((x) => x.id !== albumId)
  }),
}
