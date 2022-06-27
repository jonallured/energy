import { GlobalStore, __globalStoreTestUtils__ } from "../GlobalStore"

const albums = [
  {
    id: "album-id-0",
    title: "album-title-0",
    artworkIds: ["artwork-1-album-id-0", "artwork-2-album-id-0"],
    createdAt: "date",
  },
  {
    id: "album-id-1",
    title: "album-title-1",
    artworkIds: ["artwork-1-album-id-1", "artwork-2-album-id-1"],
    createdAt: "date",
  },
  {
    id: "album-id-2",
    title: "album-title-2",
    artworkIds: ["artwork-1-album-id-2", "artwork-2-album-id-2"],
    createdAt: "date",
  },
]

describe("AlbumsModel", () => {
  __globalStoreTestUtils__?.injectState({
    albums: { albums },
  })

  it("adds album", () => {
    const newAlbum = {
      id: "album-id-3",
      title: "album-title-3",
      artworkIds: ["artwork-1-album-id-3", "artwork-2-album-id-3"],
      createdAt: "date",
    }
    GlobalStore.actions.albums.addAlbum(newAlbum)
    const albumState = __globalStoreTestUtils__?.getCurrentState().albums.albums

    expect(albumState).toContain(newAlbum)
  })

  it("removes album", () => {
    const unwantedAlbumId = "album-id-2"
    GlobalStore.actions.albums.removeAlbum(unwantedAlbumId)
    const albumState = __globalStoreTestUtils__?.getCurrentState().albums.albums

    expect(albumState).not.toContain(unwantedAlbumId)
  })

  it("add artworks in albums", () => {
    const albumIds = ["album-id-0", "album-id-1"]
    const artworkIdsToAdd = ["new-artwork-id-1", "new-artwork-id-2"]

    GlobalStore.actions.albums.addArtworksInAlbums({ albumIds, artworkIdsToAdd })
    const albumState = __globalStoreTestUtils__?.getCurrentState().albums.albums

    albumState?.forEach((album) => {
      if (albumIds.includes(album.id)) {
        expect(album.artworkIds).toContain("new-artwork-id-1")
        expect(album.artworkIds).toContain("new-artwork-id-2")
      } else {
        expect(album.artworkIds).not.toContain("new-artwork-id-1")
        expect(album.artworkIds).not.toContain("new-artwork-id-2")
      }
    })
  })

  it("removes artworks from albums", () => {
    const albumIds = ["album-id-0", "album-id-1"]
    const artworkIdsToRemove = ["new-artwork-id-1", "new-artwork-id-2"]

    GlobalStore.actions.albums.removeArtworksFromAlbums({ albumIds, artworkIdsToRemove })
    const albumState = __globalStoreTestUtils__?.getCurrentState().albums.albums

    albumState?.forEach((album) => {
      expect(album.artworkIds).not.toContain("new-artwork-id-1")
      expect(album.artworkIds).not.toContain("new-artwork-id-2")
    })
  })
})
