import { createClient, SegmentClient } from "@segment/analytics-react-native"
import { addBreadcrumb } from "@sentry/react-native"
import { Platform } from "react-native"
import Config from "react-native-config"
import { isCohesionScreen, TrackingProvider } from "utils/track/providers"

export const SEGMENT_TRACKING_PROVIDER = "SEGMENT_TRACKING_PROVIDER"

let analytics: SegmentClient
export const SegmentTrackingProvider: TrackingProvider = {
  setup: () => {
    const writeKey = Platform.select({
      ios: __DEV__ ? Config.SEGMENT_STAGING_WRITE_KEY_IOS : Config.SEGMENT_PRODUCTION_WRITE_KEY_IOS,
      android: __DEV__
        ? Config.SEGMENT_STAGING_WRITE_KEY_ANDROID
        : Config.SEGMENT_PRODUCTION_WRITE_KEY_ANDROID,
      default: "",
    })

    if (!writeKey || writeKey === "") {
      console.warn("No Segment write key provided, skipping setup")
      return
    }

    analytics = createClient({ writeKey: writeKey })
  },

  identify: (userId, traits) => {
    analytics.identify(userId, traits)
  },

  postEvent: (info) => {
    addBreadcrumb({
      message: `${JSON.stringify(info, null, 2)}`,
      category: "analytics",
    })

    if ("action" in info) {
      const { action } = info
      if (isCohesionScreen(info)) {
        const { context_screen_owner_type } = info
        analytics.screen(context_screen_owner_type, info as any)
      } else {
        analytics.track(action, info as any)
      }
      return
    }

    console.warn("oh wow, we are not tracking this event!! we should!", { info })
    assertNever(info)
  },
}
