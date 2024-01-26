import { omit } from "lodash"
import { initializeSegment } from "system/analytics/initializeSegment"

const segmentClient = initializeSegment()

export const trackSegmentEvent = (data: any) => {
  const actionName = data.action || data.action_type
  const trackingData = omit(data, ["action_type", "action"])

  if (actionName) {
    segmentClient?.track(actionName, trackingData)
  } else {
    console.error(`Unknown analytics schema being used: ${JSON.stringify(data)}`)
  }
}
