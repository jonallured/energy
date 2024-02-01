import { ARTNativeModules } from "native_modules/ARTNativeModules"
import { fetchQuery } from "react-relay"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { createMockEnvironment } from "relay-test-utils"
import { artworkQuery } from "screens/Artwork/Artwork"
import { GlobalStore } from "system/store/GlobalStore"
import { attemptAlbumMigration } from "utils/attemptAlbumMigration"

jest.mock("react-relay", () => ({
  fetchQuery: jest.fn(),
}))

jest.mock("native_modules/ARTNativeModules", () => ({
  ARTNativeModules: {
    ARTAlbumMigrationModule: {
      readAlbums: jest.fn(),
    },
  },
}))

jest.mock("system/store/GlobalStore", () => ({
  GlobalStore: {
    actions: {
      albums: {
        addAlbum: jest.fn(),
      },
    },
  },
}))

describe("attemptAlbumMigration", () => {
  let mockRelayEnvironment: RelayModernEnvironment

  beforeEach(() => {
    mockRelayEnvironment =
      createMockEnvironment() as unknown as RelayModernEnvironment
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("does nothing if no albums are present", async () => {
    const mockReadAlbums = ARTNativeModules.ARTAlbumMigrationModule
      .readAlbums as jest.Mock
    mockReadAlbums.mockReturnValue(null)

    await attemptAlbumMigration(mockRelayEnvironment)

    expect(
      ARTNativeModules.ARTAlbumMigrationModule.readAlbums
    ).toHaveBeenCalled()
    expect(fetchQuery).not.toHaveBeenCalled()
    expect(GlobalStore.actions.albums.addAlbum).not.toHaveBeenCalled()
  })

  it("fetches artwork metadata and adds albums to the store for valid albums", async () => {
    // Mock album data returned from the native module
    const mockAlbums = [
      { name: "Album 1", artworkIDs: ["artwork1", "artwork2"] },
      { name: "Album 2", artworkIDs: ["artwork3"] },
    ]
    ;(
      ARTNativeModules.ARTAlbumMigrationModule.readAlbums as jest.Mock
    ).mockReturnValue(mockAlbums)

    // Mock successful artwork metadata fetching
    const mockArtworkData = {
      artwork: {
        title: "Artwork Title",
        artist: "Artist Name" /* other fields */,
      },
    }

    ;(fetchQuery as jest.Mock).mockImplementation(() => ({
      toPromise: () => Promise.resolve(mockArtworkData),
    }))

    await attemptAlbumMigration(mockRelayEnvironment)

    // Check if fetchQuery was called correctly
    expect(fetchQuery).toHaveBeenCalledTimes(3) // Total number of artworkIDs
    expect(fetchQuery).toHaveBeenCalledWith(
      mockRelayEnvironment,
      artworkQuery,
      {
        slug: "artwork1",
      }
    )
    expect(fetchQuery).toHaveBeenCalledWith(
      mockRelayEnvironment,
      artworkQuery,
      {
        slug: "artwork2",
      }
    )
    expect(fetchQuery).toHaveBeenCalledWith(
      mockRelayEnvironment,
      artworkQuery,
      {
        slug: "artwork3",
      }
    )

    // Check if the albums were added to the store with the correct data
    expect(GlobalStore.actions.albums.addAlbum).toHaveBeenCalledTimes(2)
    expect(GlobalStore.actions.albums.addAlbum).toHaveBeenCalledWith({
      name: "Album 1",
      items: [
        { ...mockArtworkData.artwork, slug: "artwork1" },
        { ...mockArtworkData.artwork, slug: "artwork2" },
      ],
    })
    expect(GlobalStore.actions.albums.addAlbum).toHaveBeenCalledWith({
      name: "Album 2",
      items: [{ ...mockArtworkData.artwork, slug: "artwork3" }],
    })
  })
})
