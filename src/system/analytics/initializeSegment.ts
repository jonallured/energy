import { SegmentClient, createClient } from "@segment/analytics-react-native"
import { Platform } from "react-native"
import Config from "react-native-config"

export let segmentClient = null as unknown as SegmentClient

export const initializeSegment = (): SegmentClient | null => {
  const writeKey = Platform.select({
    ios: __DEV__
      ? Config.SEGMENT_STAGING_WRITE_KEY_IOS
      : Config.SEGMENT_PRODUCTION_WRITE_KEY_IOS,
    android: __DEV__
      ? Config.SEGMENT_STAGING_WRITE_KEY_ANDROID
      : Config.SEGMENT_PRODUCTION_WRITE_KEY_ANDROID,
    default: "",
  })

  if (!writeKey || writeKey === "") {
    console.warn(
      "[initializeSegment]: Error: No Segment write key provided, skipping setup"
    )
    return null
  }

  segmentClient = createClient({ writeKey: writeKey })
  return segmentClient
}
