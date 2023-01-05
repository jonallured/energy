import { range } from "lodash"
import { ShowArtworksQuery } from "__generated__/ShowArtworksQuery.graphql"
import { setupTestWrapper } from "app/utils/test/setupTestWrapper"
import { ShowArtworks } from "./ShowArtworks"

jest.mock("react-native-collapsible-tab-view", () => ({
  ...jest.requireActual("react-native-collapsible-tab-view"),
  useFocusedTab: () => "Wow",
}))

describe("ShowArtworks", () => {
  const { renderWithRelay } = setupTestWrapper<ShowArtworksQuery>({
    Component: () => <ShowArtworks slug="some" />,
  })

  it("renders the list of works", async () => {
    const { getByTestId } = await renderWithRelay(mockProps)
    expect(getByTestId("show-artwork-list").props.data).toHaveLength(10)
  })
})

const mockProps = {
  Show: () => ({
    artworksConnection: {
      edges: range(10).map((i) => ({
        node: {
          internalID: `some-id-${i}`,
          title: "Title",
          date: "2022",
          image: {
            url: "some-url",
            aspectRatio: 1,
          },
        },
      })),
    },
  }),
}
