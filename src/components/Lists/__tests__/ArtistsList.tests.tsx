// import { waitFor } from "@testing-library/react-native"
// import { ArtistsListQuery } from "__generated__/ArtistsListQuery.graphql"
// import { ArtistsList } from "components/Lists/ArtistsList"
// import { setupTestWrapper } from "utils/test/setupTestWrapper"
// import { range } from "lodash"

describe("ArtistsList", () => {
  it("todo", () => {
    //
  })
})

// describe("ArtistsList", () => {
//   const { renderWithRelay } = setupTestWrapper<ArtistsListQuery>({
//     Component: ArtistsList,
//   })

//   it("renders the list of artists", async () => {
//     const { queryAllByText } = renderWithRelay(mockProps)
//     await waitFor(() => {
//       expect(queryAllByText("Gustav Klimt")).toHaveLength(10)
//     })
//   })
// })

// const mockProps = {
//   Partner: () => ({
//     allArtistsConnection: {
//       edges: range(10).map((i) => ({
//         node: {
//           internalID: `5deff4b96fz7e7000f36ce37-${i}`,
//           name: "Gustav Klimt",
//           imageURL: "https://d32dm0rphc51dk.cloudfront.net/Tc9k2ROn55SxNHWjYxxnrg/:version.jpg",
//           counts: { artworks: 36 },
//         },
//       })),
//     },
//   }),
// }
