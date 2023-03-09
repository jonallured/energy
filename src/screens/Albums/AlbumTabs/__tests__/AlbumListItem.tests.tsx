import { AlbumListImage } from "screens/Albums/AlbumTabs/AlbumListImage"
import { AlbumListItem } from "screens/Albums/AlbumTabs/AlbumListItem"
import { useAlbum } from "screens/Albums/useAlbum"
import { Album } from "system/store/Models/AlbumsModel"
import { SelectedItemArtwork } from "system/store/Models/SelectModeModel"
import { CachedImage } from "system/wrappers/CachedImage"
import { renderWithWrappers } from "utils/test/renderWithWrappers"

jest.mock("screens/Albums/useAlbum")

describe("AlbumListItem", () => {
  const album = {
    id: "foo",
    createdAt: "bar",
    name: "My Album",
    items: [
      { internalID: "1", slug: "artwork-1", image: { resized: { url: "image-1" } } },
      { internalID: "2", slug: "artwork-2", image: { resized: { url: "image-2" } } },
      { internalID: "3", slug: "artwork-3", image: { resized: { url: "image-3" } } },
    ] as SelectedItemArtwork[],
  } as Album

  const mockUseAlbum = useAlbum as jest.Mock

  beforeEach(() => {
    mockUseAlbum.mockImplementation(() => ({ album, artworks: album.items }))
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it("renders album name and item count", () => {
    const { getByText } = renderWithWrappers(<AlbumListItem album={album} />)
    expect(getByText(album.name)).toBeDefined()
    expect(getByText(`${album.items.length} Items`)).toBeDefined()
  })

  it("renders album images", () => {
    const { UNSAFE_getAllByType } = renderWithWrappers(<AlbumListItem album={album} />)
    const albumImages = UNSAFE_getAllByType(CachedImage)
    expect(albumImages).toHaveLength(3)
    expect(albumImages[0].props.uri).toBe(`image-3`)
    expect(albumImages[1].props.uri).toBe(`image-2`)
    expect(albumImages[2].props.uri).toBe(`image-1`)
  })

  it("renders album images with empty artwork array", () => {
    mockUseAlbum.mockImplementation(() => {})
    const emptyAlbum = { id: "foo", createdAt: "bar", name: "Empty Album", items: [] } as Album
    const { UNSAFE_queryAllByType } = renderWithWrappers(<AlbumListItem album={emptyAlbum} />)
    expect(UNSAFE_queryAllByType(AlbumListImage)).toEqual([])
  })

  it("renders album images with less than 2 artworks", () => {
    const albumWithOneArtwork = {
      name: "Album with One Artwork",
      items: [album.items[0]] as SelectedItemArtwork[],
      id: "foo",
      createdAt: "bar",
    }
    mockUseAlbum.mockImplementation(() => ({
      album: albumWithOneArtwork,
      artworks: albumWithOneArtwork.items,
    }))
    const { UNSAFE_getAllByType, getByText } = renderWithWrappers(
      <AlbumListItem album={albumWithOneArtwork} />
    )
    const albumImages = UNSAFE_getAllByType(CachedImage)
    expect(albumImages).toHaveLength(1)
    expect(getByText(`1 Item`)).toBeDefined()
  })
})
