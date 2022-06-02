import { range } from "lodash"
import { mockEnvironmentPayloadMaybe } from "shared/tests/mockEnvironmentPayload"
import { renderWithWrappersTL } from "shared/tests/renderWithWrappers"
import { Artworks } from "./Artworks"

describe("Artworks", () => {
  it("renders without throwing an error", async () => {
    renderWithWrappersTL(<Artworks slug={"some"} />)
    await mockEnvironmentPayloadMaybe(mockProps)
  })

  it("renders the list of works", async () => {
    const { getByTestId } = renderWithWrappersTL(<Artworks slug={"some"} />)
    await mockEnvironmentPayloadMaybe(mockProps)
    expect(getByTestId("artist-artwork-list").props.data).toHaveLength(10)
  })
})

const mockProps = {
  Artist: () => ({
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
