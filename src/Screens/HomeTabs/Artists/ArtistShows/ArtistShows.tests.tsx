import { renderWithWrappersTL } from "shared/tests/renderWithWrappers"
import { ArtistShows } from "./ArtistShows"

describe("ArtistShows", () => {
  it("renders without throwing an error", async () => {
    renderWithWrappersTL(<ArtistShows />)
  })
})
