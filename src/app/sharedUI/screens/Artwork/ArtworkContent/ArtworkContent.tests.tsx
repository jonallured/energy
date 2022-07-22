import { ArtworkContent } from "./ArtworkContent"
import { mockEnvironmentPayloadMaybe } from "shared/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "shared/tests/renderWithWrappers"

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}))

describe("ArtworkContent", () => {
  it("renders without throwing an error", async () => {
    renderWithWrappers(<ArtworkContent slug="slug" />)
    await mockEnvironmentPayloadMaybe(mockProps)
  })

  it("renders the list of artists", async () => {
    const { queryByText } = renderWithWrappers(<ArtworkContent slug="slug" />)
    await mockEnvironmentPayloadMaybe(mockProps)

    expect(queryByText("some title")).toBeDefined()
    expect(queryByText("some price")).toBeDefined()
    expect(queryByText("some medium type")).toBeDefined()
  })
})

const mockProps = {
  Artwork: () => ({
    artwork: {
      title: "some title",
      price: "some price",
      date: "some date",
      mediumType: {
        name: "some medium type",
      },
      dimensions: {
        in: "some dimensions in",
        cm: "some dimensions cm",
      },
      inventoryId: "some inventory id",
      artist: {
        name: "some artist anem",
      },
    },
  }),
  Image: () => ({
    url: "some artwork url",
    aspectRatio: 1,
  }),
}
