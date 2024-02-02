import { renderHook } from "@testing-library/react-hooks"
import { useFocusedTab } from "react-native-collapsible-tab-view"
import {
  GlobalStoreProvider,
  __globalStoreTestUtils__,
} from "system/store/GlobalStore"
import { SelectedItem } from "system/store/Models/SelectModeModel"
import { useIsScreenVisible } from "utils/hooks/useIsScreenVisible"
import { useSetSelectModeActiveTab } from "utils/hooks/useSetSelectModeActiveTab"

jest.mock("react-native-collapsible-tab-view", () => ({
  useFocusedTab: jest.fn(),
}))

jest.mock("utils/hooks/useIsScreenVisible", () => ({
  useIsScreenVisible: jest.fn(),
}))

describe("useSetSelectModeActiveTab", () => {
  const mockUseIsScreenVisible = useIsScreenVisible as jest.Mock
  const mockUseFocusedTab = useFocusedTab as jest.Mock

  const HookWrapper: React.FC = ({ children }) => {
    return <GlobalStoreProvider>{children}</GlobalStoreProvider>
  }

  const item = { internalID: "abc" } as SelectedItem

  const getSessionState = () =>
    __globalStoreTestUtils__?.getCurrentState().selectMode.sessionState!

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("sets active tab when screen is visible and active tab is same as the name", () => {
    __globalStoreTestUtils__?.injectState({
      selectMode: {
        sessionState: {
          activeTab: "ArtistArtworks",
        },
      },
    })

    mockUseIsScreenVisible.mockReturnValueOnce(true)
    mockUseFocusedTab.mockReturnValueOnce("ArtistArtworks")

    renderHook(
      () => {
        return useSetSelectModeActiveTab({
          name: "ArtistArtworks",
          items: [item],
        })
      },
      {
        wrapper: HookWrapper,
      }
    )

    expect(getSessionState().activeTab).toBe("ArtistArtworks")
    expect(getSessionState().activeTabItems).toEqual([item])
  })

  it("does not set active tab when screen is visible but active tab is different from the name", () => {
    __globalStoreTestUtils__?.injectState({
      selectMode: {
        sessionState: {
          activeTab: "ArtistArtworks",
        },
      },
    })

    mockUseIsScreenVisible.mockReturnValueOnce(true)
    mockUseFocusedTab.mockReturnValueOnce("SomeOtherTab")

    renderHook(
      () => {
        return useSetSelectModeActiveTab({
          name: "ArtistShows",
          items: [],
        })
      },
      {
        wrapper: HookWrapper,
      }
    )

    expect(getSessionState().activeTab).toBe("ArtistArtworks")
  })

  it("does not set active tab when screen is not visible", () => {
    mockUseIsScreenVisible.mockReturnValueOnce(false)

    renderHook(
      () => {
        return useSetSelectModeActiveTab({
          name: "ArtistDocuments",
          items: [],
        })
      },
      {
        wrapper: HookWrapper,
      }
    )

    expect(getSessionState().activeTab).not.toBe("ArtistDocuments")
  })
})
