import { GlobalStore, __globalStoreTestUtils__ } from "app/system/store/GlobalStore"

const albums = [
  {
    id: "album-id-0",
    name: "album-name-0",
    artworkIds: ["artwork-1-album-id-0", "artwork-2-album-id-0"],
    createdAt: "date",
  },
  {
    id: "album-id-1",
    name: "album-name-1",
    artworkIds: ["artwork-1-album-id-1", "artwork-2-album-id-1"],
    createdAt: "date",
  },
  {
    id: "album-id-2",
    name: "album-name-2",
    artworkIds: ["artwork-1-album-id-2", "artwork-2-album-id-2"],
    createdAt: "date",
  },
]

const selectedArtworksForNewAlbum = {
  "snoop-dogg": ["snoop-1-album-id-0", "snoop-2-album-id-0"],
}

const selectedArtworksForExistingAlbum = {
  pitbull: ["pitbull-1-album-id-2", "pitbull-2-album-id-2"],
}

describe("AlbumsModel", () => {
  __globalStoreTestUtils__?.injectState({
    albums: {
      albums,
      sessionState: {
        selectedArtworksForNewAlbum,
        selectedArtworksForExistingAlbum,
      },
    },
  })

  it("adds album", () => {
    const newAlbum = {
      name: "album-name-3",
      artworkIds: ["artwork-1-album-id-3", "artwork-2-album-id-3"],
      installShotUrls: [],
      documentIds: [],
    }
    GlobalStore.actions.albums.addAlbum(newAlbum)
    const albumState = __globalStoreTestUtils__?.getCurrentState().albums.albums

    expect(albumState?.[albumState?.length - 1].name).toEqual(newAlbum.name)
    expect(albumState?.[albumState?.length - 1].artworkIds).toEqual(newAlbum.artworkIds)
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

    GlobalStore.actions.albums.addItemsInAlbums({
      albumIds,
      artworkIdsToAdd,
      installShotUrlsToAdd: [],
      documentIdsToAdd: [],
    })
    const albumState = __globalStoreTestUtils__?.getCurrentState().albums.albums
    const selectedArtworksForCreateAlbum =
      __globalStoreTestUtils__?.getCurrentState().albums.sessionState.selectedArtworksForNewAlbum

    albumState?.forEach((album) => {
      if (albumIds.includes(album.id)) {
        expect(album.artworkIds).toContain("new-artwork-id-1")
        expect(album.artworkIds).toContain("new-artwork-id-2")
      } else {
        expect(album.artworkIds).not.toContain("new-artwork-id-1")
        expect(album.artworkIds).not.toContain("new-artwork-id-2")
      }
    })

    // selectedArtworksForCreateAlbum should be epmty after successfull update
    expect(selectedArtworksForCreateAlbum).toEqual({})
  })

  describe("Edit Album ", () => {
    it("updates name and new artwork ids", () => {
      const album = {
        albumId: "album-id-1",
        name: "album-name",
        artworkIds: ["artwork-1-album-id-6", "artwork-2-album-id-6"],
      }
      GlobalStore.actions.albums.editAlbum(album)
      const albumState = __globalStoreTestUtils__?.getCurrentState().albums.albums
      const selectedArtworksForEditAlbum =
        __globalStoreTestUtils__?.getCurrentState().albums.sessionState
          .selectedArtworksForExistingAlbum

      expect(albumState?.map((album) => album.name)).toContain(album.name)
      expect(albumState?.map((album) => album.artworkIds)).toContain(album.artworkIds)

      // selectedArtworksForEditAlbum should be epmty after successfull update
      expect(selectedArtworksForEditAlbum).toEqual({})
    })
  })

  describe("selects artworks to update a new album", () => {
    it("adds the artworks for a new artist", () => {
      const artworks = {
        artistSlug: "Rihanna",
        artworkIds: ["Rihanna-artwork-1", "Rihanna-artwork-2"],
      }
      GlobalStore.actions.albums.selectArtworksForNewAlbum(artworks)
      const selectedArtworks =
        __globalStoreTestUtils__?.getCurrentState().albums.sessionState.selectedArtworksForNewAlbum

      expect(selectedArtworks?.[artworks.artistSlug]).toEqual(artworks.artworkIds)
    })

    it("replaces the artworks with new artworks for the existing artist", () => {
      __globalStoreTestUtils__?.injectState({
        albums: {
          sessionState: {
            selectedArtworksForNewAlbum: selectedArtworksForNewAlbum,
          },
        },
      })
      const artworks = {
        artistSlug: "pitbull",
        artworkIds: ["pitbull-new-artwork-1", "pitbull-new-artwork-2"],
      }
      GlobalStore.actions.albums.selectArtworksForNewAlbum(artworks)
      const selectedArtworks =
        __globalStoreTestUtils__?.getCurrentState().albums.sessionState.selectedArtworksForNewAlbum

      expect(selectedArtworks?.[artworks.artistSlug]).toEqual(artworks.artworkIds)
    })
  })

  describe("selects artworks to update the existing album", () => {
    it("adds the artworks for a new artist", () => {
      const artworks = {
        artistSlug: "bruno-mars",
        artworkIds: ["bruno-mars-artwork-1", "bruno-mars-artwork-2"],
      }
      GlobalStore.actions.albums.selectArtworksForExistingAlbum(artworks)
      const selectedArtworks =
        __globalStoreTestUtils__?.getCurrentState().albums.sessionState
          .selectedArtworksForExistingAlbum

      expect(selectedArtworks?.[artworks.artistSlug]).toEqual(artworks.artworkIds)
    })

    it("replaces the artworks with new artworks for the existing artist", () => {
      __globalStoreTestUtils__?.injectState({
        albums: {
          sessionState: {
            selectedArtworksForExistingAlbum: selectedArtworksForExistingAlbum,
          },
        },
      })
      const artworks = {
        artistSlug: "snoop-dogg",
        artworkIds: ["snoop-dogg-artwork-1", "snoop-dogg-artwork-2"],
      }

      GlobalStore.actions.albums.selectArtworksForExistingAlbum(artworks)
      const selectedArtworks =
        __globalStoreTestUtils__?.getCurrentState().albums.sessionState
          .selectedArtworksForExistingAlbum

      expect(selectedArtworks?.[artworks.artistSlug]).toEqual(artworks.artworkIds)
    })

    it("clears the selectedArtworksForEditAlbum if artworks is null", () => {
      GlobalStore.actions.albums.clearSelectedArtworksForEditAlbum()
      const selectedArtworks =
        __globalStoreTestUtils__?.getCurrentState().albums.sessionState
          .selectedArtworksForExistingAlbum

      expect(selectedArtworks).toEqual({})
    })
  })
})
