import { mockEnvironmentPayloadMaybe } from "shared/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "shared/tests/renderWithWrappers"
import { ShowInstalls } from "./ShowInstalls"

describe("ShowInstalls", () => {
  it("renders ListEmptyComponent", async () => {
    const { getByText } = renderWithWrappers(<ShowInstalls slug={"someSlug"} />)
    await mockEnvironmentPayloadMaybe(mockPropsEmptyList)
    expect(getByText("No results to display")).toBeTruthy()
  })

  it("renders the list of installs", async () => {
    const { getByTestId } = renderWithWrappers(<ShowInstalls slug={"someSlug"} />)
    await mockEnvironmentPayloadMaybe(mockProps)
    images.forEach((image) => {
      expect(getByTestId(image.url)).toBeTruthy()
    })
  })
})

const mockPropsEmptyList = {
  Show: () => ({
    images: [],
  }),
}

const images = [
  {
    internalID: "first-install-shot",
    url: "some-url-1",
  },
  {
    internalID: "second-install-shot",
    url: "some-url-2",
  },
]

const mockProps = {
  Show: () => ({
    images,
  }),
}
