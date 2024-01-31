import { useIsFocused } from "@react-navigation/native"
import { ScreenNames } from "Navigation"
import { useFocusedTab } from "react-native-collapsible-tab-view"

export const useIsScreenVisible = (screenName: ScreenNames) => {
  const isRouteFocused = (() => {
    try {
      // Calling hook conditionally to guard against being outside of RouteContext
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useIsFocused()
    } catch {
      return null
    }
  })()

  const activeTab = (() => {
    try {
      // Calling hook conditionally to guard against being outside of TabContext
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useFocusedTab()
    } catch {
      return null
    }
  })()

  const isScreenVisible = (() => {
    // In plain stack-based route
    if (activeTab == null) {
      return isRouteFocused
    }

    // In tab-based route
    return activeTab === screenName
  })()

  return isScreenVisible
}
