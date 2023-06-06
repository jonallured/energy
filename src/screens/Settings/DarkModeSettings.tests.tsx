import { act, fireEvent, screen } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "system/store/GlobalStore"
import { renderWithWrappers } from "utils/test/renderWithWrappers"
import { DarkModeSettings } from "./DarkModeSettings"

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
}))

const mockColorScheme = jest.fn()

jest.mock("react-native/Libraries/Utilities/useColorScheme", () => ({
  useColorScheme: mockColorScheme,
}))

describe("DarkModeSettings", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectState({
      devicePrefs: {
        forcedColorScheme: "light",
        usingSystemColorScheme: false,
      },
    })
  })

  it("should render correctly", () => {
    renderWithWrappers(<DarkModeSettings />)

    const darkModeToggle = screen.getByLabelText("Dark mode always on switch")
    const followSystemToggle = screen.getByLabelText("Follow System Settings switch")

    expect(screen.queryByText("Dark Mode")).toBeOnTheScreen()
    expect(darkModeToggle).toBeOnTheScreen()
    expect(darkModeToggle).toHaveProp("value", false)

    expect(screen.queryByText("Follow System Settings")).toBeOnTheScreen()
    expect(followSystemToggle).toBeOnTheScreen()
    expect(followSystemToggle).toHaveProp("value", false)
  })

  describe("System has Dark Mode enabled", () => {
    beforeEach(() => {
      mockColorScheme.mockImplementation(() => "dark")
    })

    it("should toggle Dark mode always on", async () => {
      renderWithWrappers(<DarkModeSettings />)

      const darkModeToggle = screen.getByLabelText("Dark mode always on switch")
      const followSystemToggle = screen.getByLabelText("Follow System Settings switch")
      expect(darkModeToggle).toHaveProp("value", false)
      expect(followSystemToggle).toHaveProp("value", false)

      fireEvent(darkModeToggle, "onValueChange", true)

      expect(darkModeToggle).toHaveProp("value", true)
      expect(followSystemToggle).toHaveProp("value", false)
    })

    it("should toggle Follow System Settings", () => {
      renderWithWrappers(<DarkModeSettings />)

      const darkModeToggle = screen.getByLabelText("Dark mode always on switch")
      const followSystemToggle = screen.getByLabelText("Follow System Settings switch")
      expect(darkModeToggle).toHaveProp("value", false)
      expect(followSystemToggle).toHaveProp("value", false)

      fireEvent(followSystemToggle, "onValueChange", true)

      expect(darkModeToggle).toHaveProp("value", false)
      expect(followSystemToggle).toHaveProp("value", true)
    })
  })

  describe("System has Light Mode enabled", () => {
    beforeEach(() => {
      mockColorScheme.mockImplementation(() => "light")
    })

    it("should toggle Dark mode always on", () => {
      renderWithWrappers(<DarkModeSettings />)

      const darkModeToggle = screen.getByLabelText("Dark mode always on switch")
      const followSystemToggle = screen.getByLabelText("Follow System Settings switch")
      expect(darkModeToggle).toHaveProp("value", false)
      expect(followSystemToggle).toHaveProp("value", false)

      fireEvent(darkModeToggle, "onValueChange", true)

      expect(darkModeToggle).toHaveProp("value", true)
      expect(followSystemToggle).toHaveProp("value", false)
    })

    it("should toggle Follow System Settings", () => {
      renderWithWrappers(<DarkModeSettings />)

      const darkModeToggle = screen.getByLabelText("Dark mode always on switch")
      const followSystemToggle = screen.getByLabelText("Follow System Settings switch")
      expect(darkModeToggle).toHaveProp("value", false)
      expect(followSystemToggle).toHaveProp("value", false)

      fireEvent(followSystemToggle, "onValueChange", true)

      expect(darkModeToggle).toHaveProp("value", false)
      expect(followSystemToggle).toHaveProp("value", true)
    })
  })

  describe("Should persist settings", () => {
    it("should persist Dark mode always on", () => {
      __globalStoreTestUtils__?.injectState({
        devicePrefs: {
          forcedColorScheme: "dark",
          usingSystemColorScheme: false,
        },
      })

      renderWithWrappers(<DarkModeSettings />)

      const darkModeToggle = screen.getByLabelText("Dark mode always on switch")
      const followSystemToggle = screen.getByLabelText("Follow System Settings switch")
      expect(darkModeToggle).toHaveProp("value", true)
      expect(followSystemToggle).toHaveProp("value", false)
    })

    it("should persist Follow System Settings", () => {
      __globalStoreTestUtils__?.injectState({
        devicePrefs: {
          forcedColorScheme: "light",
          usingSystemColorScheme: true,
        },
      })

      renderWithWrappers(<DarkModeSettings />)

      const darkModeToggle = screen.getByLabelText("Dark mode always on switch")
      const followSystemToggle = screen.getByLabelText("Follow System Settings switch")

      expect(darkModeToggle).toHaveProp("value", false)
      expect(followSystemToggle).toHaveProp("value", true)
    })
  })
})
