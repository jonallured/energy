import { range } from "lodash"
import { mockEnvironmentPayloadMaybe } from "shared/tests/mockEnvironmentPayload"
import { renderWithWrappersTL } from "shared/tests/renderWithWrappers"
import { Shows } from "./Shows"

describe("Shows", () => {
  it("renders without throwing an error", async () => {
    renderWithWrappersTL(<Shows />)
    await mockEnvironmentPayloadMaybe(mockProps)
  })

  it("renders the list of shows", async () => {
    const { queryAllByText } = renderWithWrappersTL(<Shows />)
    await mockEnvironmentPayloadMaybe(mockProps)

    expect(queryAllByText("Gustav Klimts shows")).toHaveLength(10)
  })
})

const mockProps = {
  Partner: () => ({
    showsConnection: {
      edges: range(10).map((i) => ({
        node: {
          internalID: `5deff4b96fz7e7000f36ce37-${i}`,
          name: "Gustav Klimts shows",
          coverImage: "https://d32dm0rphc51dk.cloudfront.net/Tc9k2ROn55SxNHWjYxxnrg/:version.jpg",
          formattedStartAt: "May 27",
          formattedEndAt: "June 15, 2022",
        },
      })),
    },
  }),
}
