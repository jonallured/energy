import { waitFor } from "@testing-library/react-native"
import { ShowsQuery } from "__generated__/ShowsQuery.graphql"
import { range } from "lodash"
import { setupTestWrapper } from "utils/test/setupTestWrapper"
import { Shows } from "./Shows"

describe("Shows", () => {
  const { renderWithRelay } = setupTestWrapper<ShowsQuery>({
    Component: Shows,
    variables: {
      partnerID: "foo",
    },
  })

  it("only renders the list of shows with artworkCount value more than 0", async () => {
    const { getAllByText } = renderWithRelay(mockProps)
    await waitFor(() => {
      expect(getAllByText("Gustav Klimts shows").length).toBe(10)
    })
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
          coverImage:
            "https://d32dm0rphc51dk.cloudfront.net/Tc9k2ROn55SxNHWjYxxnrg/:version.jpg",
          formattedStartAt: "May 27",
          formattedEndAt: "June 15, 2022",
        },
      })),
    },
  }),
}
