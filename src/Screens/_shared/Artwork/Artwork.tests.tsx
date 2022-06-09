import { getEssentialProps } from "shared/tests/getEssentialProps"
import { mockEnvironmentPayloadMaybe } from "shared/tests/mockEnvironmentPayload"
import { renderWithWrappersTL } from "shared/tests/renderWithWrappers"
import { Artwork } from "./Artwork"

describe("Artwork", () => {
  it("renders without throwing an error", async () => {
    renderWithWrappersTL(<Artwork {...getEssentialProps()} />)
    await mockEnvironmentPayloadMaybe(mockProps)
  })

  it("renders the list of artists", async () => {
    const { queryByText } = renderWithWrappersTL(<Artwork {...getEssentialProps()} />)
    await mockEnvironmentPayloadMaybe(mockProps)

    expect(queryByText("some title")).toBeDefined()
    expect(queryByText("some price")).toBeDefined()
    expect(queryByText("some medium type")).toBeDefined()
  })
})

const mockProps = {
  Artwork: () => ({
    artwork: {
      image: {
        url: "some artwork url",
        aspectRatio: "some aspectRatio",
      },
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
}
