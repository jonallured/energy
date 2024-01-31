import {
  ActionType,
  AddedToAlbum,
  AuthModalType,
  CompletedOfflineSync,
  ContextModule,
  CreatedAlbum,
  Intent,
  OwnerType,
  SentContent,
  SuccessfullyLoggedIn,
  ToggledPresentationModeSetting,
} from "@artsy/cohesion"
import { useToast } from "components/Toast/ToastContext"
import { useCallback } from "react"
import JSONTree from "react-native-json-tree"
import { useTracking } from "react-tracking"
import { UseTrackScreenViewProps } from "system/hooks/useTrackScreen"
import { GlobalStore } from "system/store/GlobalStore"

export const useAppTracking = () => {
  const tracking = useTracking()
  const { toast } = useToast()

  const userID = GlobalStore.useAppState((state) => state.auth.userID)
  const launchCount = GlobalStore.useAppState(
    (store) => store.system.launchCount
  )

  const isAnalyticsVisualizerEnabled = GlobalStore.useAppState(
    (store) => store.artsyPrefs.isAnalyticsVisualizerEnabled
  )

  // Enable the visualizer via Settings > Dev Menu
  const trackingWithVisualizer = (event: any) => {
    toast.show({
      message: <JSONTree data={event} />,
      title: "",
    })

    tracking.trackEvent(event)
  }

  const trackEvent = isAnalyticsVisualizerEnabled
    ? trackingWithVisualizer
    : tracking.trackEvent

  return {
    /**
     * System Events
     */
    maybeTrackFirstInstall: () => {
      if (launchCount > 1) {
        return
      }

      const event = {
        action: "first_user_install",
      }

      trackEvent(event)
    },

    trackLoginSuccess: () => {
      const event: SuccessfullyLoggedIn = {
        action: ActionType.successfullyLoggedIn,
        auth_redirect: "",
        context_module: ContextModule.popUpModal,
        intent: Intent.login,
        type: AuthModalType.login,
        service: "email",
        trigger: "click",
        user_id: userID as string,
      }

      trackEvent(event)
    },

    trackScreenView: (props: UseTrackScreenViewProps) => {
      const event = {
        action: ActionType.screen,
        context_screen: props.name,
        context_screen_owner_type: props.type,
        context_screen_owner_id: props.internalID,
        context_screen_owner_slug: props.slug,
      }

      trackEvent(event)
    },

    /**
     * Main Events
     */

    trackSentContent: () => {
      const event: SentContent = {
        action: ActionType.sentContent,
        context_screen_owner_type: OwnerType.artwork,

        // TODO
        context_screen_owner_id: "id",
        context_screen_owner_slug: "slug",
      }

      trackEvent(event)
    },

    trackCreatedAlbum: () => {
      const event: CreatedAlbum = {
        action: ActionType.createdAlbum,
        context_screen_owner_type: OwnerType.artwork,

        // TODO
        context_screen_owner_id: "id",
        context_screen_owner_slug: "slug",
      }

      trackEvent(event)
    },

    trackAddedToAlbum: (albumnName: string) => {
      const event: AddedToAlbum = {
        action: ActionType.addedToAlbum,
        context_screen_owner_type: OwnerType.artwork,

        // TODO
        context_screen_owner_id: "id",
        context_screen_owner_slug: "slug",
        album_name: albumnName,
      }

      trackEvent(event)
    },

    /**
     * Settings Events
     */

    trackToggledPresentationViewSetting: (label: string, value: boolean) => {
      const event: ToggledPresentationModeSetting = {
        action: ActionType.toggledPresentationModeSetting,
        label,
        enabled: value,
      }

      trackEvent(event)
    },

    trackCompletedOfflineSync: () => {
      const event: CompletedOfflineSync = {
        action: ActionType.completedOfflineSync,
      }

      trackEvent(event)
    },
  }
}
