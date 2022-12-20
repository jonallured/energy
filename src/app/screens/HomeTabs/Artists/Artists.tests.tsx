import { renderWithWrappers } from "app/utils/test/renderWithWrappers"
import { range } from "lodash"
import { mockEnvironmentPayload } from "app/utils/test/mockEnvironmentPayload"
import { Artists } from "./Artists"

describe("Artists", () => {
  it("renders without throwing an error", async () => {
    renderWithWrappers(<Artists />)
    await mockEnvironmentPayload(mockProps)
  })

  it("renders the list of artists", async () => {
    const { queryAllByText } = renderWithWrappers(<Artists />)
    await mockEnvironmentPayload(mockProps)

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
