import { GlobalStore } from "app/store/GlobalStore"
import { act } from "react-test-renderer"
import { mockEnvironmentPayloadMaybe } from "shared/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "shared/tests/renderWithWrappers"
import { AlbumArtworks } from "./AlbumArtworks"

jest.mock("@react-navigation/native", () => ({
  useRoute: () => ({ params: { albumId: "album-id" } }),
  useNavigation: jest.fn(),
}))

jest.unmock("react-relay")

describe("AlbumArtworks", () => {
  it("renders without throwing an error", async () => {
    const { queryByText } = renderWithWrappers(<AlbumArtworks />)

    act(() => {
      GlobalStore.actions.albums.addAlbum(album)
    })

    await mockEnvironmentPayloadMaybe(mockProps)

    expect(queryByText("artwork-1-title")).toBeDefined()
  })
  it("renders with throwing an error", async () => {
    const { queryByText } = renderWithWrappers(<AlbumArtworks />)

    act(() => {
      GlobalStore.actions.albums.addAlbum(album)
    })

    await mockEnvironmentPayloadMaybe(mockProps)

    expect(queryByText("artwork-title-that-does-not-exist")).toBeDefined()
  })
})

const mockProps = {
  Artwork: () => ({
    image: {
      url: "some artwork url",
      aspectRatio: 1,
    },
    title: "artwork-1-title",
    price: "some price",
    date: "some date",
    id: "album-id",
    internalId: "album-id",
  }),
}

const album = {
  id: "album-id",
  title: "album-title",
  artworkIds: ["artwork-1-id"],
  createdAt: "date",
}
