import { useNavigation, useRoute } from "@react-navigation/native"
import { renderHook } from "@testing-library/react-hooks"
import {
  useNavigateToSavedHistory,
  useSaveNavigationHistory,
} from "system/hooks/useNavigationHistory"
import { __globalStoreTestUtils__ } from "system/store/GlobalStore"
import { HookWrapper } from "utils/test/renderWithWrappers"

jest.mock("@react-navigation/native", () => ({
  useRoute: jest.fn(),
  useNavigation: jest.fn(),
}))

describe("#useNavigationHistory", () => {
  const mockUseRoute = useRoute as jest.Mock
  const mockUseNavigation = useNavigation as jest.Mock

  beforeEach(() => {
    __globalStoreTestUtils__?.injectState({
      system: {
        sessionState: {
          navigationHistory: {},
        },
      },
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("#useSaveNavigationHistory", () => {
    it("saves navigation history to global store with the correct lookup key and values", () => {
      const lookupKey = "home"

      mockUseRoute.mockImplementation(() => ({
        name: "HomeRoute",
        params: { foo: "bar" },
      }))

      const { result } = renderHook(() => useSaveNavigationHistory(), {
        wrapper: HookWrapper,
      })

      result.current.saveNavigationHistory(lookupKey)

      const navigationHistory =
        __globalStoreTestUtils__?.getCurrentState().system.sessionState
          .navigationHistory

      expect(navigationHistory).toEqual({ home: ["HomeRoute", { foo: "bar" }] })
    })
  })

  describe("useNavigateToSavedHistory", () => {
    it("should navigate to saved history", () => {
      const lookupKey = "home"
      const navigateSpy = jest.fn()
      const goBackSpy = jest.fn()

      mockUseRoute.mockImplementation(() => ({
        name: "HomeRoute",
        params: { foo: "bar" },
      }))

      mockUseNavigation.mockImplementation(() => ({
        navigate: navigateSpy,
        goBack: goBackSpy,
      }))

      const { result } = renderHook(() => useNavigateToSavedHistory(), {
        wrapper: HookWrapper,
      })

      result.current.navigateToSavedHistory({ lookupKey })

      expect(goBackSpy).not.toHaveBeenCalled()
      expect(navigateSpy).toHaveBeenCalledWith("HomeRoute", {
        foo: "bar",
      })
    })

    it("should go back if lookup key not found in navigation history", async () => {
      const navigateSpy = jest.fn()
      const goBackSpy = jest.fn()

      mockUseRoute.mockImplementation(() => ({
        name: "HomeRoute",
        params: { foo: "bar" },
      }))

      mockUseNavigation.mockImplementation(() => ({
        navigate: navigateSpy,
        goBack: goBackSpy,
      }))

      const { result } = renderHook(() => useNavigateToSavedHistory(), {
        wrapper: HookWrapper,
      })

      result.current.navigateToSavedHistory({ lookupKey: "someInvalidKey" })

      expect(goBackSpy).toHaveBeenCalled()
      expect(navigateSpy).not.toHaveBeenCalled()
    })
  })
})
