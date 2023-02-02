import { waitFor } from "@testing-library/react-native"
import { Image } from "react-native"
import { fetchQuery } from "react-relay"
import { AlbumListImage } from "app/components/Items/AlbumListImage"
import { __globalStoreTestUtils__ } from "app/system/store/GlobalStore"
import { renderWithWrappers } from "app/utils/test/renderWithWrappers"

jest.mock("react-relay", () => ({
  ...jest.requireActual("react-relay"),
  fetchQuery: jest.fn().mockReturnValue({
    toPromise: jest.fn(),
  }),
}))

describe("AlbumListImage", () => {
  const mockFetchQuery = fetchQuery as jest.Mock

  global.console.log = jest.fn()

  it("renders correctly", async () => {
    mockFetchQuery.mockImplementation(() => ({
      toPromise: jest.fn().mockResolvedValue({
        artwork: {
          image: {
            resized: {
              url: "https://www.example.com",
            },
          },
        },
      }),
    }))

    const screen = renderWithWrappers(<AlbumListImage slug="slug" />)

    await waitFor(() => {
      expect(screen.UNSAFE_getAllByType(Image)).toBeTruthy()
    })
  })

  it("removes an artwork from an album if 404", async () => {
    const artworkIdToRemove = "test-slug-1"

    __globalStoreTestUtils__?.injectState({
      albums: {
        albums: [
          {
            id: "test-album-1",
            artworkIds: [artworkIdToRemove, "test-slug-2"],
          },
          {
            id: "test-album-2",
            artworkIds: [artworkIdToRemove, "test-slug-3"],
          },
        ],
      },
    })

    mockFetchQuery.mockImplementation(() => ({
      toPromise: jest.fn().mockRejectedValue({
        message: "Artwork Not Found",
      }),
    }))

    const screen = renderWithWrappers(<AlbumListImage slug={artworkIdToRemove} />)

    await waitFor(() => {
      expect(screen.UNSAFE_queryAllByType(Image).length).toBe(0)

      __globalStoreTestUtils__?.getCurrentState().albums.albums.forEach((album) => {
        expect(album.artworkIds).not.toContain(artworkIdToRemove)
      })
    })
  })
})
