import {
  ActionType,
  AddedToAlbum,
  AuthModalType,
  CompletedOfflineSync,
  CreatedAlbum,
  Intent,
  OwnerType,
  SentContent,
  SuccessfullyLoggedIn,
  ToggledPresentationModeSetting,
} from "@artsy/cohesion"
import { useToast } from "components/Toast/ToastContext"
import JSONTree from "react-native-json-tree"
import { useTracking } from "react-tracking"
import { getSegmentClient } from "system/analytics/initializeSegment"
import { UseTrackScreenViewProps } from "system/hooks/useTrackScreen"
import { GlobalStore } from "system/store/GlobalStore"
import { Album } from "system/store/Models/AlbumsModel"

export const useAppTracking = () => {
  const tracking = useTracking()
  const { toast } = useToast()

  const partnerID = GlobalStore.useAppState(
    (state) => state.auth.activePartnerID
  )
  const userID = GlobalStore.useAppState((state) => state.auth.userID)

  const launchCount = GlobalStore.useAppState(
    (store) => store.system.launchCount
  )

  const isAnalyticsVisualizerEnabled = GlobalStore.useAppState(
    (store) => store.artsyPrefs.isAnalyticsVisualizerEnabled
  )

  const segmentClient = getSegmentClient()

  const trackEvent = (event: any) => {
    const payload = {
      ...event,
      partner_id: partnerID,
      user_id: userID,
    }

    // Enable the visualizer via Settings > Dev Menu
    if (isAnalyticsVisualizerEnabled) {
      toast.show({
        hideTimeout: 3500,
        message: <JSONTree data={payload} />,
        title: "",
      })
    }

    tracking.trackEvent(payload)
  }

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
        anonymous_id: segmentClient?.userInfo.get().anonymousId,
      }

      trackEvent(event)
    },

    trackLoginSuccess: (userID: string) => {
      const event: SuccessfullyLoggedIn = {
        action: ActionType.successfullyLoggedIn,
        auth_redirect: "",
        context_module: "" as any, // don't need it
        intent: Intent.login,
        type: AuthModalType.login,
        service: "email",
        trigger: "click",
        user_id: userID,
      }

      trackEvent(event)
    },

    trackScreenView: (props: UseTrackScreenViewProps) => {
      const event = {
        action: ActionType.screen,
        context_screen: props.name,
        context_screen_owner_slug: props.slug,
        context_screen_owner_id: props.internalID,
      }

      /**
       * For segment screen tracking, we don't use the normal track api, but
       * rather the screen api.
       * @see https://segment.com/docs/connections/spec/screen/
       */
      if (segmentClient) {
        segmentClient.screen(props.type as string, event)
      }
    },

    /**
     * Main Events
     */

    trackSentContent: ({ artworkIds, albumId }: TrackSentContentProps) => {
      const event: SentContent = {
        action: ActionType.sentContent,
        context_screen_owner_type: OwnerType.artwork,
        artwork_id: artworkIds,
        album_id: albumId as string,
      }

      trackEvent(event)
    },

    trackCreatedAlbum: () => {
      const event: CreatedAlbum = {
        action: ActionType.createdAlbum,
        context_screen_owner_type: OwnerType.artwork,
      }

      trackEvent(event)
    },

    trackAddedToAlbum: (album: Album) => {
      const event: AddedToAlbum = {
        action: ActionType.addedToAlbum,
        context_screen_owner_type: OwnerType.album,
        album_name: album.name,
        context_screen_owner_id: album.id,
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

export interface TrackSentContentProps {
  artworkIds: string[]
  albumId?: string
}
