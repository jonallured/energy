describe("AlbumListImage", () => {
  it("needs to be done", () => {
    // TODO: Fix this in a follow-up PR
  })
})

// import { waitFor } from "@testing-library/react-native"
// import { AlbumListImage } from "app/screens/Albums/AlbumTabs/AlbumListImage"
// import { __globalStoreTestUtils__ } from "app/system/store/GlobalStore"
// import { SelectedItemArtwork } from "app/system/store/Models/SelectModeModel"
// import { renderWithWrappers } from "app/utils/test/renderWithWrappers"
// import { Image } from "react-native"
// import { fetchQuery } from "react-relay"

// jest.mock("react-relay", () => ({
//   ...jest.requireActual("react-relay"),
//   fetchQuery: jest.fn().mockReturnValue({
//     toPromise: jest.fn(),
//   }),
// }))

// describe("AlbumListImage", () => {
//   const mockFetchQuery = fetchQuery as jest.Mock
//   const artwork = {
//     artwork: {
//       image: {
//         url: "https://www.example.com",
//       },
//     },
//   }

//   global.console.log = jest.fn()

//   it("renders correctly", async () => {
//     mockFetchQuery.mockImplementation(() => ({
//       toPromise: jest.fn().mockResolvedValue(artwork),
//     }))

//     const screen = renderWithWrappers(
//       <AlbumListImage slug="slug" image={artwork.artwork.image as any} />
//     )

//     await waitFor(() => {
//       expect(screen.UNSAFE_getAllByType(Image)).toBeTruthy()
//     })
//   })

//   it("removes an artwork from an album if 404", async () => {
//     const artworkToRemove = { internalID: "test-slug-1" }

//     __globalStoreTestUtils__?.injectState({
//       albums: {
//         albums: [
//           {
//             id: "test-album-1",
//             items: [artworkToRemove, { internalID: "test-slug-2" }] as SelectedItemArtwork[],
//           },
//           {
//             id: "test-album-2",
//             items: [artworkToRemove, { internalID: "test-slug-3" }] as SelectedItemArtwork[],
//           },
//         ],
//       },
//     })

//     mockFetchQuery.mockImplementation(() => ({
//       toPromise: jest.fn().mockRejectedValue({
//         message: "Artwork Not Found",
//       }),
//     }))

//     const screen = renderWithWrappers(
//       <AlbumListImage slug={artworkToRemove.internalID} image={artwork.artwork.image as any} />
//     )

//     await waitFor(() => {
//       expect(screen.UNSAFE_queryAllByType(Image).length).toBe(0)

//       __globalStoreTestUtils__?.getCurrentState().albums.albums.forEach((album) => {
//         expect(album.items).not.toContain(artworkToRemove)
//       })
//     })
//   })
// })
