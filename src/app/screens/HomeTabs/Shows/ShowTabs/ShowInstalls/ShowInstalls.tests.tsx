import { mockEnvironmentPayloadMaybe } from "shared/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "shared/tests/renderWithWrappers"
import { ShowInstalls } from "./ShowInstalls"

jest.mock("react-native-collapsible-tab-view", () => ({
  ...jest.requireActual("react-native-collapsible-tab-view"),
  useFocusedTab: () => "Wow",
}))

describe("ShowInstalls", () => {
  it("renders ListEmptyComponent", async () => {
    const { getByText } = renderWithWrappers(<ShowInstalls slug="someSlug" />)
    await mockEnvironmentPayloadMaybe(mockPropsEmptyList)
    expect(getByText("No show installs shots to display")).toBeTruthy()
  })

  it("renders the list of installs", async () => {
    const { getByTestId } = renderWithWrappers(<ShowInstalls slug="someSlug" />)
    await mockEnvironmentPayloadMaybe(mockProps)
    images.forEach((image) => {
      expect(getByTestId(image.resized.url)).toBeTruthy()
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
    resized: { url: "some-url-1" },
  },
  {
    internalID: "second-install-shot",
    resized: { url: "some-url-2" },
  },
]

const mockProps = {
  Show: () => ({
    images,
  }),
}
