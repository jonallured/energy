import { GlobalStore, __globalStoreTestUtils__ } from "app/system/store/GlobalStore"
import { Album } from "app/system/store/Models/AlbumsModel"
import { SelectedItem } from "app/system/store/Models/SelectModeModel"

const albums = [
  {
    id: "album-id-0",
    name: "album-name-0",
    items: [{ internalID: "artwork-1-album-id-0" }, { internalID: "artwork-2-album-id-0" }],
    createdAt: "date",
  },
  {
    id: "album-id-1",
    name: "album-name-1",
    items: [{ internalID: "artwork-1-album-id-1" }, { internalID: "artwork-2-album-id-1" }],
    createdAt: "date",
  },
  {
    id: "album-id-2",
    name: "album-name-2",
    items: [{ internalID: "artwork-1-album-id-2" }, { internalID: "artwork-2-album-id-2" }],
    createdAt: "date",
  },
] as unknown as Album[]

describe("AlbumsModel", () => {
  __globalStoreTestUtils__?.injectState({
    albums: {
      albums,
    },
  })

  it("adds album", () => {
    const newAlbum = {
      name: "album-name-3",
      items: [{ internalID: "artwork-1-album-id-3" }, { internalID: "artwork-2-album-id-3" }],
    } as unknown as Album

    GlobalStore.actions.albums.addAlbum(newAlbum)
    const albumState = __globalStoreTestUtils__?.getCurrentState().albums.albums

    expect(albumState?.[albumState?.length - 1].name).toEqual(newAlbum.name)
    expect(albumState?.[albumState?.length - 1].items).toEqual(newAlbum.items)
  })

  it("removes album", () => {
    const unwantedAlbumId = "album-id-2"
    GlobalStore.actions.albums.removeAlbum(unwantedAlbumId)
    const albumState = __globalStoreTestUtils__?.getCurrentState().albums.albums

    expect(albumState).not.toContain(unwantedAlbumId)
  })

  it("add items to albums", () => {
    const albumIds = ["album-id-0", "album-id-1"]
    const artworksToAdd = [
      { internalID: "new-artwork-id-1" },
      { internalID: "new-artwork-id-2" },
    ] as unknown as SelectedItem[]

    GlobalStore.actions.albums.addItemsToAlbums({
      albumIds,
      items: artworksToAdd,
    })
    const albumState = __globalStoreTestUtils__?.getCurrentState().albums.albums
    const selectedArtworksForCreateAlbum =
      __globalStoreTestUtils__?.getCurrentState().selectMode.sessionState.selectedItems

    albumState?.forEach((album) => {
      if (albumIds.includes(album.id)) {
        expect(album.items.some((item) => item?.internalID === "new-artwork-id-1")).toBe(true)
        expect(album.items.some((item) => item?.internalID === "new-artwork-id-2")).toBe(true)
      } else {
        expect(album.items.some((item) => item?.internalID === "new-artwork-id-1")).not.toBe(true)
        expect(album.items.some((item) => item?.internalID === "new-artwork-id-2")).not.toBe(true)
      }
    })

    // Should be epmty after successfull update
    expect(selectedArtworksForCreateAlbum).toEqual([])
  })

  it("removes items from albums", () => {
    const artworkIdToRemove = "new-artwork-id-2"
    const albumIds = ["album-id-0", "album-id-1"]
    const artworksToAdd = [
      { internalID: "new-artwork-id-1" },
      { internalID: artworkIdToRemove },
    ] as unknown as SelectedItem[]

    GlobalStore.actions.albums.addItemsToAlbums({
      albumIds,
      items: artworksToAdd,
    })

    GlobalStore.actions.albums.removeItemFromAlbums(artworkIdToRemove)

    const albums = __globalStoreTestUtils__?.getCurrentState().albums.albums

    albums?.forEach((album) => {
      album.items.forEach((item) => {
        expect(item?.internalID).not.toBe(artworkIdToRemove)
      })
    })
  })

  describe("Edit Album ", () => {
    it("updates name and new artwork ids", () => {
      const album = {
        albumId: "album-id-1",
        name: "album-name",
        items: [
          { internalID: "artwork-1-album-id-6" },
          { internalID: "artwork-2-album-id-6" },
        ] as unknown as SelectedItem[],
      }

      GlobalStore.actions.albums.editAlbum(album)

      const albumState = __globalStoreTestUtils__?.getCurrentState().albums.albums
      const selectedArtworksForEditAlbum =
        __globalStoreTestUtils__?.getCurrentState().selectMode.sessionState.selectedItems

      expect(albumState?.map((album) => album.name)).toContain(album.name)
      expect(albumState?.map((album) => album.items)).toContain(album.items)

      expect(selectedArtworksForEditAlbum).toEqual([])
    })
  })
})
