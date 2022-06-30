import { range } from "lodash"
import { mockEnvironmentPayloadMaybe } from "shared/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "shared/tests/renderWithWrappers"
import { ShowArtworks } from "./ShowArtworks"

describe("ShowArtworks", () => {
  it("renders without throwing an error", async () => {
    renderWithWrappers(<ShowArtworks slug={"some"} />)
    await mockEnvironmentPayloadMaybe(mockProps)
  })

  it("renders the list of works", async () => {
    const { getByTestId } = renderWithWrappers(<ShowArtworks slug={"some"} />)
    await mockEnvironmentPayloadMaybe(mockProps)
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
          imageURL: "some-url",
        },
      })),
    },
  }),
}
