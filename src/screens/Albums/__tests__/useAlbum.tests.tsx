import { renderHook } from "@testing-library/react-hooks"
import { useAlbum } from "screens/Albums/useAlbum"
import { __globalStoreTestUtils__ } from "system/store/GlobalStore"
import { Album } from "system/store/Models/AlbumsModel"
import { SelectedItem } from "system/store/Models/SelectModeModel"
import { HookWrapper } from "utils/test/renderWithWrappers"

describe("useAlbum", () => {
  const album = {
    id: "123",
    name: "Test Album",
    items: [
      { __typename: "Artwork", internalID: "abc" },
      { __typename: "PartnerDocument", internalID: "def" },
      { __typename: "Image", internalID: "ghi" },
    ] as SelectedItem[],
  } as Album

  beforeEach(() => {
    __globalStoreTestUtils__?.injectState({
      albums: {
        albums: [album],
      },
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should return the album and selected items", () => {
    const { result } = renderHook(() => useAlbum({ albumId: "123" }), {
      wrapper: HookWrapper,
    })

    expect(result.current.album).toEqual(album)
    expect(result.current.artworks).toEqual([
      { __typename: "Artwork", internalID: "abc" },
    ])
    expect(result.current.documents).toEqual([
      { __typename: "PartnerDocument", internalID: "def" },
    ])
    expect(result.current.installs).toEqual([
      { __typename: "Image", internalID: "ghi" },
    ])
  })

  it("should return undefined for album if it does not exist", () => {
    const { result } = renderHook(() => useAlbum({ albumId: "456" }), {
      wrapper: HookWrapper,
    })

    expect(result.current.album).toBeUndefined()
    expect(result.current.artworks).toEqual([])
    expect(result.current.documents).toEqual([])
    expect(result.current.installs).toEqual([])
  })

  describe("#saveAlbum", () => {
    it("should create a new album on save", () => {
      const { result } = renderHook(() => useAlbum({ albumId: null }), {
        wrapper: HookWrapper,
      })

      result.current.saveAlbum({
        mode: "create",
        values: { albumName: "test" },
      })

      const albumState =
        __globalStoreTestUtils__?.getCurrentState().albums.albums

      expect(albumState?.[1].name).toEqual("test")
    })

    it("should edit an existing album on save", () => {
      const { result } = renderHook(() => useAlbum({ albumId: "123" }), {
        wrapper: HookWrapper,
      })

      result.current.saveAlbum({
        mode: "edit",
        values: { albumName: "Updated Name" },
      })

      const albumState =
        __globalStoreTestUtils__?.getCurrentState().albums.albums

      expect(albumState?.[0].name).toEqual("Updated Name")
    })
  })
})
