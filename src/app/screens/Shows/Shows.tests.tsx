import { range } from "lodash"
import { mockEnvironmentPayload } from "app/utils/test/mockEnvironmentPayload"
import { renderWithWrappers } from "app/utils/test/renderWithWrappers"
import { Shows } from "./Shows"

describe("Shows", () => {
  it("renders without throwing an error", async () => {
    renderWithWrappers(<Shows />)
    await mockEnvironmentPayload(mockProps)
  })

  it("only renders the list of shows with artworkCount value more than 0", async () => {
    const { queryAllByText } = renderWithWrappers(<Shows />)
    await mockEnvironmentPayload(mockProps)

    expect(queryAllByText("Gustav Klimts shows")).toHaveLength(9)
  })
})

const mockProps = {
  Partner: () => ({
    showsConnection: {
      edges: range(10).map((i) => ({
        node: {
          internalID: `5deff4b96fz7e7000f36ce37-${i}`,
          artworksCount: i,
          name: "Gustav Klimts shows",
          coverImage: "https://d32dm0rphc51dk.cloudfront.net/Tc9k2ROn55SxNHWjYxxnrg/:version.jpg",
          formattedStartAt: "May 27",
          formattedEndAt: "June 15, 2022",
        },
      })),
    },
  }),
}
