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
import { useTracking } from "react-tracking"
import { GlobalStore } from "system/store/GlobalStore"

export const useAppTracking = () => {
  const { trackEvent } = useTracking()

  const userID = GlobalStore.useAppState((state) => state.auth.userID)
  const launchCount = GlobalStore.useAppState((store) => store.system.launchCount)

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

    trackScreenView: (screenName: string) => {
      const event = {
        action: ActionType.screen,
        context_screen_owner_type: screenName,
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
