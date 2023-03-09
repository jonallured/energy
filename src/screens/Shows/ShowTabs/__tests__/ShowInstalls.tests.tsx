import { waitFor } from "@testing-library/react-native"
import { ShowInstallsQuery } from "__generated__/ShowInstallsQuery.graphql"
import { ShowInstalls } from "screens/Shows/ShowTabs/ShowInstalls"
import { setupTestWrapper } from "utils/test/setupTestWrapper"

jest.mock("react-native-collapsible-tab-view", () => ({
  ...jest.requireActual("react-native-collapsible-tab-view"),
  useFocusedTab: () => "Wow",
}))

describe("ShowInstalls", () => {
  const { renderWithRelay } = setupTestWrapper<ShowInstallsQuery>({
    Component: () => <ShowInstalls slug="some" />,
  })

  it("renders ListEmptyComponent", async () => {
    const { getByText } = renderWithRelay({
      Show: () => ({
        images: [],
      }),
    })
    await waitFor(() => {
      expect(getByText("No show install shots to display")).toBeTruthy()
    })
  })

  it("renders the list of installs", async () => {
    const { getByTestId } = renderWithRelay(mockProps)
    await waitFor(() => {
      images.forEach((image) => {
        expect(getByTestId(image.url)).toBeTruthy()
      })
    })
  })
})

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
