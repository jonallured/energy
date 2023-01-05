import { range } from "lodash"
import { ArtistsQuery } from "__generated__/ArtistsQuery.graphql"
import { Artists } from "app/screens/Artists/Artists"
import { setupTestWrapper } from "app/utils/test/setupTestWrapper"

describe("Artists", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistsQuery>({
    Component: Artists,
    variables: {
      partnerID: "foo",
    },
  })

  it("renders the list of artists", async () => {
    const { queryAllByText } = await renderWithRelay(mockProps)
    expect(queryAllByText("Gustav Klimt")).toHaveLength(10)
  })
})

const mockProps = {
  Partner: () => ({
    allArtistsConnection: {
      edges: range(10).map((i) => ({
        node: {
          internalID: `5deff4b96fz7e7000f36ce37-${i}`,
          name: "Gustav Klimt",
          imageURL: "https://d32dm0rphc51dk.cloudfront.net/Tc9k2ROn55SxNHWjYxxnrg/:version.jpg",
          counts: { artworks: 36 },
        },
      })),
    },
  }),
}
