import { range } from "lodash"
import { mockEnvironmentPayload } from "app/utils/test/mockEnvironmentPayload"
import { renderWithWrappers } from "app/utils/test/renderWithWrappers"
import { ShowArtworks } from "./ShowArtworks"

jest.mock("react-native-collapsible-tab-view", () => ({
  ...jest.requireActual("react-native-collapsible-tab-view"),
  useFocusedTab: () => "Wow",
}))

describe("ShowArtworks", () => {
  it("renders without throwing an error", async () => {
    renderWithWrappers(<ShowArtworks slug="some" />)
    await mockEnvironmentPayload(mockProps)
  })

  it("renders the list of works", async () => {
    const { getByTestId } = renderWithWrappers(<ShowArtworks slug="some" />)
    await mockEnvironmentPayload(mockProps)
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
