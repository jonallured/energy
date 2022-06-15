import { range } from "lodash"
import { mockEnvironmentPayloadMaybe } from "shared/tests/mockEnvironmentPayload"
import { renderWithWrappersTL } from "shared/tests/renderWithWrappers"
import { ArtistArtworks } from "./ArtistArtworks"

describe("ArtistArtworks", () => {
  it("renders without throwing an error", async () => {
    renderWithWrappersTL(<ArtistArtworks slug={"some"} />)
    await mockEnvironmentPayloadMaybe(mockProps)
  })

  it("renders the list of works", async () => {
    const { getByTestId } = renderWithWrappersTL(<ArtistArtworks slug={"some"} />)
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
