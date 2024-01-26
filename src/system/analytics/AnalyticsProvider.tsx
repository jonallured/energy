import track from "react-tracking"
import { trackSegmentEvent } from "system/analytics/trackSegmentEvent"

export const AnalyticsProvider = track(undefined, {
  dispatch: trackSegmentEvent,
})(({ children }: any) => {
  return children
})
