import { Platform } from "react-native"
import Config from "react-native-config"
import type { SegmentClient } from "@segment/analytics-react-native"

let segmentClient = null as unknown as SegmentClient

export const getSegmentClient = () => segmentClient

export const initializeSegment = (): SegmentClient | null => {
  const { createClient } = require("@segment/analytics-react-native")

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
