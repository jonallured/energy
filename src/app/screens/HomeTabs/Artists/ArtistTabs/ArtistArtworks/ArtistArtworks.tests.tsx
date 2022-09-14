import { range } from "lodash"
import { mockEnvironmentPayloadMaybe } from "shared/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "shared/tests/renderWithWrappers"
import { ArtistArtworks } from "./ArtistArtworks"

describe("ArtistArtworks", () => {
  it("renders without throwing an error", async () => {
    renderWithWrappers(<ArtistArtworks slug={"some"} />)
    await mockEnvironmentPayloadMaybe(mockProps)
  })

  it("renders the list of works", async () => {
    const { getByTestId } = renderWithWrappers(<ArtistArtworks slug={"some"} />)
    await mockEnvironmentPayloadMaybe(mockProps)
    expect(getByTestId("artist-artwork-list").props.data).toHaveLength(10)
  })
})

const mockProps = {
  Partner: () => ({
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
