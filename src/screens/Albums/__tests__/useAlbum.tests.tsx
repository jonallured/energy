import { renderHook } from "@testing-library/react-hooks"
import { Providers } from "Providers"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { createMockEnvironment } from "relay-test-utils"
import { useAlbum } from "screens/Albums/useAlbum"
import { __globalStoreTestUtils__ } from "system/store/GlobalStore"
import { Album } from "system/store/Models/AlbumsModel"
import { SelectedItem } from "system/store/Models/SelectModeModel"

describe("useAlbum", () => {
  const album = {
    id: "123",
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
    jest.resetAllMocks()
  })

  const HookWrapper: React.FC = ({ children }) => {
    const environment = createMockEnvironment()

    return (
      <Providers relayEnvironment={environment as unknown as RelayModernEnvironment}>
        {children}
      </Providers>
    )
  }

  it("should return the album and selected items", () => {
    const { result } = renderHook(() => useAlbum({ albumId: "123" }), {
      wrapper: HookWrapper,
    })

    expect(result.current.album).toEqual(album)
    expect(result.current.artworks).toEqual([{ __typename: "Artwork", internalID: "abc" }])
    expect(result.current.documents).toEqual([{ __typename: "PartnerDocument", internalID: "def" }])
    expect(result.current.installs).toEqual([{ __typename: "Image", internalID: "ghi" }])
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
})
