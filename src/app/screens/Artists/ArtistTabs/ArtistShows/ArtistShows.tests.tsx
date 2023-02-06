import { waitFor } from "@testing-library/react-native"
import { range } from "lodash"
import { ArtistShowsQuery } from "__generated__/ArtistShowsQuery.graphql"
import { setupTestWrapper } from "app/utils/test/setupTestWrapper"
import { ArtistShows } from "./ArtistShows"

describe("ArtistShows", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistShowsQuery>({
    Component: () => <ArtistShows slug="some" />,
  })

  it("renders the list of shows for the selected artist", async () => {
    const { queryAllByText } = renderWithRelay(mockProps)
    await waitFor(() => {
      expect(queryAllByText("Gustav Klimts shows")).toHaveLength(10)
    })
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
