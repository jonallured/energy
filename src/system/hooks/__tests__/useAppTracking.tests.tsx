import { renderHook } from "@testing-library/react-hooks"
import { useTracking } from "react-tracking"
import { useAppTracking } from "system/hooks/useAppTracking"
import { GlobalStore } from "system/store/GlobalStore"

jest.mock("system/store/GlobalStore", () => ({
  GlobalStore: {
    useAppState: jest.fn(),
  },
}))

describe("useAppTracking", () => {
  const mockUseTracking = useTracking as jest.Mock
  const mockGlobalStore = GlobalStore as jest.Mocked<typeof GlobalStore>

  beforeEach(() => {
    jest.resetAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("#maybeTrackFirstInstall", () => {
    it("should call trackEvent when maybeTrackFirstInstall is called", () => {
      const spy = jest.fn()
      mockUseTracking.mockReturnValue({ trackEvent: spy })
      mockGlobalStore.useAppState.mockReturnValue(1)

      const { result } = renderHook(() => useAppTracking())
      result.current.maybeTrackFirstInstall()

      expect(spy).toHaveBeenCalledTimes(1)
    })

    it("should not call trackEvent when maybeTrackFirstInstall is called and launchCount is not 1", () => {
      const spy = jest.fn()
      mockUseTracking.mockReturnValue({ trackEvent: spy })
      mockGlobalStore.useAppState.mockReturnValue(2)

      const { result } = renderHook(() => useAppTracking())
      result.current.maybeTrackFirstInstall()

      expect(spy).not.toHaveBeenCalled()
    })
  })

  it("#trackLoginSuccess", () => {
    const spy = jest.fn()
    mockUseTracking.mockReturnValue({ trackEvent: spy })
    mockGlobalStore.useAppState.mockReturnValue("testUserID")

    const { result } = renderHook(() => useAppTracking())
    result.current.trackLoginSuccess()

    expect(spy).toHaveBeenCalledWith({
      action: "successfullyLoggedIn",
      auth_redirect: "",
      context_module: "popUpModal",
      intent: "login",
      type: "login",
      service: "email",
      trigger: "click",
      user_id: "testUserID",
    })
  })

  it("#trackScreenView", () => {
    const spy = jest.fn()
    mockUseTracking.mockReturnValue({ trackEvent: spy })

    const { result } = renderHook(() => useAppTracking())
    result.current.trackScreenView("TestScreen")

    expect(spy).toHaveBeenCalledWith({
      action: "screen",
      context_screen_owner_type: "TestScreen",
    })
  })

  it("#trackSentContent", () => {
    const spy = jest.fn()
    mockUseTracking.mockReturnValue({ trackEvent: spy })

    const { result } = renderHook(() => useAppTracking())
    result.current.trackSentContent()

    expect(spy).toHaveBeenCalledWith({
      action: "sentContent",
      context_screen_owner_type: "artwork",
      context_screen_owner_id: "id",
      context_screen_owner_slug: "slug",
    })
  })

  it("#trackCreatedAlbum", () => {
    const spy = jest.fn()
    mockUseTracking.mockReturnValue({ trackEvent: spy })

    const { result } = renderHook(() => useAppTracking())
    result.current.trackCreatedAlbum()

    expect(spy).toHaveBeenCalledWith({
      action: "createdAlbum",
      context_screen_owner_type: "artwork",
      context_screen_owner_id: "id",
      context_screen_owner_slug: "slug",
    })
  })

  it("#trackAddedToAlbum", () => {
    const spy = jest.fn()
    mockUseTracking.mockReturnValue({ trackEvent: spy })

    const { result } = renderHook(() => useAppTracking())
    result.current.trackAddedToAlbum("TestAlbum")

    expect(spy).toHaveBeenCalledWith({
      action: "addedToAlbum",
      context_screen_owner_type: "artwork",
      context_screen_owner_id: "id",
      context_screen_owner_slug: "slug",
      album_name: "TestAlbum",
    })
  })

  it("#trackToggledPresentationViewSetting", () => {
    const spy = jest.fn()
    mockUseTracking.mockReturnValue({ trackEvent: spy })

    const { result } = renderHook(() => useAppTracking())
    result.current.trackToggledPresentationViewSetting("TestLabel", true)

    expect(spy).toHaveBeenCalledWith({
      action: "toggledPresentationModeSetting",
      label: "TestLabel",
      enabled: true,
    })
  })

  it("#trackCompletedOfflineSync", () => {
    const spy = jest.fn()
    mockUseTracking.mockReturnValue({ trackEvent: spy })

    const { result } = renderHook(() => useAppTracking())
    result.current.trackCompletedOfflineSync()

    expect(spy).toHaveBeenCalledWith({
      action: "completedOfflineSync",
    })
  })
})
