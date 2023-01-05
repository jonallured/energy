import { ShowInstallsQuery } from "__generated__/ShowInstallsQuery.graphql"
import { setupTestWrapper } from "app/utils/test/setupTestWrapper"
import { ShowInstalls } from "./ShowInstalls"

jest.mock("react-native-collapsible-tab-view", () => ({
  ...jest.requireActual("react-native-collapsible-tab-view"),
  useFocusedTab: () => "Wow",
}))

describe("ShowInstalls", () => {
  const { renderWithRelay } = setupTestWrapper<ShowInstallsQuery>({
    Component: () => <ShowInstalls slug="some" />,
  })

  it("renders ListEmptyComponent", async () => {
    const { getByText } = await renderWithRelay(mockPropsEmptyList)
    expect(getByText("No show installs shots to display")).toBeTruthy()
  })

  it("renders the list of installs", async () => {
    const { getByTestId } = await renderWithRelay(mockProps)
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
