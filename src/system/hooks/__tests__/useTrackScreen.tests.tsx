import { useIsFocused as useIsRouteFocused } from "@react-navigation/native"
import { renderHook } from "@testing-library/react-hooks"
import { useFocusedTab } from "react-native-collapsible-tab-view"
import { useAppTracking } from "system/hooks/useAppTracking"
import { useTrackScreen } from "system/hooks/useTrackScreen"

jest.mock("system/hooks/useAppTracking", () => ({
  useAppTracking: jest.fn(),
}))
jest.mock("@react-navigation/native", () => ({
  useIsFocused: jest.fn(),
}))
jest.mock("react-native-collapsible-tab-view", () => ({
  useFocusedTab: jest.fn(),
}))

describe("useTrackScreen", () => {
  const mockUseRouteIsFocused = useIsRouteFocused as jest.Mock
  const mockUseAppTracking = useAppTracking as jest.Mock
  const mockUseFocusedTab = useFocusedTab as jest.Mock

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should track screen when route is focused", () => {
    const screenName = "TestScreen" as any
    const spy = jest.fn()

    mockUseRouteIsFocused.mockReturnValue(true)
    mockUseAppTracking.mockReturnValue({ trackScreenView: spy })

    renderHook(() => useTrackScreen(screenName))
    expect(spy).toHaveBeenCalledWith(screenName)
  })

  it("should track screen when activeTab == screenName", () => {
    const screenName = "ActiveTab" as any
    const spy = jest.fn()

    mockUseRouteIsFocused.mockReturnValue(true)
    mockUseAppTracking.mockReturnValue({ trackScreenView: spy })
    mockUseFocusedTab.mockReturnValue("ActiveTab")

    renderHook(() => useTrackScreen(screenName))
    expect(spy).toHaveBeenCalled()
  })

  it("should not track screen when route is not focused", () => {
    const screenName = "TestScreen" as any
    const spy = jest.fn()

    mockUseRouteIsFocused.mockReturnValue(false)
    mockUseAppTracking.mockReturnValue({ trackScreenView: spy })

    renderHook(() => useTrackScreen(screenName))
    expect(spy).not.toHaveBeenCalled()
  })

  it("should not track screen when activeTab != screenName", () => {
    const screenName = "TestScreen" as any
    const spy = jest.fn()

    mockUseRouteIsFocused.mockReturnValue(true)
    mockUseAppTracking.mockReturnValue({ trackScreenView: spy })
    mockUseFocusedTab.mockReturnValue("AnotherTab")

    renderHook(() => useTrackScreen(screenName))
    expect(spy).not.toHaveBeenCalled()
  })
})
