import { renderHook } from "@testing-library/react-hooks"
import { useTracking } from "react-tracking"
import { getSegmentClient } from "system/analytics/initializeSegment"
import { useAppTracking } from "system/hooks/useAppTracking"
import { GlobalStore } from "system/store/GlobalStore"
import { Album } from "system/store/Models/AlbumsModel"

jest.mock("system/store/GlobalStore", () => ({
  GlobalStore: {
    useAppState: jest.fn(),
  },
}))

jest.mock("system/analytics/initializeSegment", () => ({
  getSegmentClient: jest.fn(),
}))

describe("useAppTracking", () => {
  const mockUseTracking = useTracking as jest.Mock
  const mockGlobalStore = GlobalStore as jest.Mocked<typeof GlobalStore>
  const mockGetSegmentClient = getSegmentClient as jest.Mock

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
    result.current.trackLoginSuccess("testUserID")

    expect(spy).toHaveBeenCalledWith({
      action: "successfullyLoggedIn",
      auth_redirect: "",
      context_module: "",
      intent: "login",
      type: "login",
      service: "email",
      trigger: "click",
      user_id: "testUserID",
      partner_id: "testUserID",
    })
  })

  it("#trackScreenView", () => {
    const spy = jest.fn()

    mockGetSegmentClient.mockReturnValue({
      screen: spy,
    })

    const { result } = renderHook(() => useAppTracking())
    result.current.trackScreenView({
      name: "AddItemsToAlbum",
      type: "Album",
      internalID: "internalID",
      slug: "slug",
    })

    expect(spy).toHaveBeenCalledWith("Album", {
      action: "screen",
      context_screen: "AddItemsToAlbum",
      context_screen_owner_slug: "slug",
      context_screen_owner_id: "internalID",
    })
  })

  it("#trackSentContent", () => {
    const spy = jest.fn()
    mockUseTracking.mockReturnValue({ trackEvent: spy })

    const { result } = renderHook(() => useAppTracking())
    result.current.trackSentContent({
      artworkIds: ["foo", "bar"],
      albumId: "albumId",
    })

    expect(spy).toHaveBeenCalledWith({
      action: "sentContent",
      context_screen_owner_type: "artwork",
      partner_id: undefined,
      user_id: undefined,
      artwork_id: ["foo", "bar"],
      album_id: "albumId",
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
      partner_id: undefined,
      user_id: undefined,
    })
  })

  it("#trackAddedToAlbum", () => {
    const spy = jest.fn()
    mockUseTracking.mockReturnValue({ trackEvent: spy })

    const { result } = renderHook(() => useAppTracking())
    result.current.trackAddedToAlbum({
      id: "TestID",
      name: "TestAlbum",
    } as Album)

    expect(spy).toHaveBeenCalledWith({
      action: "addedToAlbum",
      context_screen_owner_type: "album",
      context_screen_owner_id: "TestID",
      album_name: "TestAlbum",
      partner_id: undefined,
      user_id: undefined,
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
