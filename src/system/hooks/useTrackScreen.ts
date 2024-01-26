import { useIsFocused as useIsRouteFocused } from "@react-navigation/native"
import { NavigationScreens } from "Navigation"
import { useEffect } from "react"
import { useFocusedTab } from "react-native-collapsible-tab-view"
import { useAppTracking } from "system/hooks/useAppTracking"

type Screens =
  | keyof NavigationScreens

  // Collection of different tab-based screens
  | "Albums"
  | "AlbumArtworks"
  | "AlbumDocuments"
  | "AlbumInstalls"
  | "Artists"
  | "ArtistArtworks"
  | "ArtistDocuments"
  | "ArtistShows"
  | "EditArtworkInCms"
  | "Shows"
  | "ShowArtworks"
  | "ShowDocuments"
  | "ShowInstalls"

export const useTrackScreen = (screenName: Screens) => {
  const { trackScreenView } = useAppTracking()

  const isRouteFocused = (() => {
    try {
      // Calling hook conditionally to guard against being outside of RouteContext
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useIsRouteFocused()
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

  const shouldTrackScreen = (() => {
    // In plain stack-based route
    if (activeTab == null) {
      return isRouteFocused
    }

    // In tab-based route
    return activeTab === screenName
  })()

  useEffect(() => {
    if (shouldTrackScreen) {
      trackScreenView(screenName)
    }
  }, [shouldTrackScreen])
}
