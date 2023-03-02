import { getAlbumIds } from "app/screens/Albums/AlbumTabs/AlbumTabs"
import { SelectedItem } from "app/system/store/Models/SelectModeModel"

describe("getAlbumIds", () => {
  const items = [
    { __typename: "Artwork", internalID: "1" },
    { __typename: "Artwork", internalID: "2" },
    { __typename: "Image", resized: { url: "http://example.com/image.jpg" } },
    { __typename: "PartnerDocument", internalID: "3" },
  ] as SelectedItem[]

  it("returns an object with artworkIds, installShotUrls, and documentIds", () => {
    expect(getAlbumIds(items)).toEqual({
      artworkIds: ["1", "2"],
      installShotUrls: ["http://example.com/image.jpg"],
      documentIds: ["3"],
    })
  })

  it("returns an object with empty arrays when passed an empty array", () => {
    expect(getAlbumIds([])).toEqual({
      artworkIds: [],
      installShotUrls: [],
      documentIds: [],
    })
  })

  it("filters out items that are not Artwork, Image, or PartnerDocument", () => {
    const items = [
      { __typename: "Artwork", internalID: "1" },
      { __typename: "Artist", internalID: "2" },
      { __typename: "Image", resized: { url: "http://example.com/image.jpg" } },
      { __typename: "Gallery", internalID: "3" },
      { __typename: "PartnerDocument", internalID: "4" },
    ] as SelectedItem[]

    expect(getAlbumIds(items)).toEqual({
      artworkIds: ["1"],
      installShotUrls: ["http://example.com/image.jpg"],
      documentIds: ["4"],
    })
  })

  it("returns artworkIds as empty array when there are no Artwork items", () => {
    const items = [
      { __typename: "Image", resized: { url: "http://example.com/image.jpg" } },
      { __typename: "PartnerDocument", internalID: "2" },
    ] as SelectedItem[]

    expect(getAlbumIds(items)).toEqual({
      artworkIds: [],
      installShotUrls: ["http://example.com/image.jpg"],
      documentIds: ["2"],
    })
  })

  it("returns installShotUrls as empty array when there are no Image items", () => {
    const items = [
      { __typename: "Artwork", internalID: "1" },
      { __typename: "PartnerDocument", internalID: "2" },
    ] as SelectedItem[]

    expect(getAlbumIds(items)).toEqual({
      artworkIds: ["1"],
      installShotUrls: [],
      documentIds: ["2"],
    })
  })

  it("returns documentIds as empty array when there are no PartnerDocument items", () => {
    const items = [
      { __typename: "Artwork", internalID: "1" },
      { __typename: "Image", resized: { url: "http://example.com/image.jpg" } },
    ] as SelectedItem[]

    expect(getAlbumIds(items)).toEqual({
      artworkIds: ["1"],
      installShotUrls: ["http://example.com/image.jpg"],
      documentIds: [],
    })
  })
})
