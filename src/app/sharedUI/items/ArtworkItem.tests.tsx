import { mockEnvironmentPayloadMaybe } from "shared/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "shared/tests/renderWithWrappers"
import { ArtworkItem } from "./ArtworkItem"

describe("ArtworkItem", () => {
  it("renders without throwing an error", async () => {
    renderWithWrappers(<ArtworkItem artworkId="some-id" />)
    await mockEnvironmentPayloadMaybe(mockProps)
  })

  it("renders the artwork item", async () => {
    const { queryByText } = renderWithWrappers(<ArtworkItem artworkId="some-id" />)

    await mockEnvironmentPayloadMaybe(mockProps)

    expect(queryByText("artwork-1-name")).toBeDefined()
  })
})

const mockProps = {
  Artwork: () => ({
    image: {
      url: "some artwork url",
      aspectRatio: 1,
    },
    name: "artwork-1-name",
    price: "some price",
    date: "some date",
    id: "album-id",
    internalId: "album-id",
  }),
}
