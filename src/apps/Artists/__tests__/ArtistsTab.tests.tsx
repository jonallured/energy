import { useNavigation } from "@react-navigation/native"
import { fireEvent } from "@testing-library/react-native"
import { ArtistsTab } from "apps/Artists/ArtistsTab"
import { renderWithWrappers } from "utils/test/renderWithWrappers"

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}))

jest.mock("components/Lists/ArtistsList", () => {
  const { View, Text } = require("react-native")
  return {
    ArtistsList: (props: any) => {
      return (
        <View
          onPress={() => {
            props.onItemPress({
              slug: "slug",
              name: "name",
            })
          }}
        >
          <Text>ArtistsList</Text>
        </View>
      )
    },
  }
})

describe("ArtistsTab", () => {
  const mockUseNavigation = useNavigation as jest.Mock

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders", () => {
    const { findByText } = renderWithWrappers(<ArtistsTab />)
    expect(findByText("ArtistsList")).toBeTruthy()
  })

  it("triggers onItemPress callback", () => {
    const spy = jest.fn()

    mockUseNavigation.mockImplementation(() => ({
      navigate: spy,
    }))

    const { getByText } = renderWithWrappers(<ArtistsTab />)

    fireEvent.press(getByText("ArtistsList"))
    expect(spy).toHaveBeenCalledWith("ArtistTabs", {
      name: "name",
      slug: "slug",
    })
  })
})
