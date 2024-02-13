import { RouteNames } from "Navigation"
import { useEffect } from "react"
import { useAppTracking } from "system/hooks/useAppTracking"
import { useIsScreenVisible } from "utils/hooks/useIsScreenVisible"

export type ScreenTypes =
  | "Album"
  | "Albums"
  | "Artist"
  | "Artists"
  | "Artwork"
  | "Conversation"
  | "Settings"
  | "Search"
  | "Show"
  | "Shows"

export interface UseTrackScreenViewProps {
  name: RouteNames
  /** Corresponds to context_screen_owner_type */
  type?: ScreenTypes
  internalID?: string
  slug?: string
  /**
   * In most instances we want to track screen on render, but in other
   * instances (such as swiping through artworks) we want to track manually.
   */
  lazy?: boolean
}

export const useTrackScreen = ({
  lazy = false,
  ...props
}: UseTrackScreenViewProps) => {
  const { trackScreenView } = useAppTracking()

  const isScreenVisible = useIsScreenVisible(props.name)

  useEffect(() => {
    if (isScreenVisible && !lazy) {
      trackScreenView(props)
    }
  }, [isScreenVisible])

  return {
    trackScreenView: () => trackScreenView(props),
  }
}
