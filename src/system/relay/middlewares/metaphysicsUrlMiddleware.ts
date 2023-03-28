import { urlMiddleware } from "react-relay-network-modern/node8"
import { unsafe__getAuth, unsafe__getEnvironment } from "system/store/GlobalStore"
import { getUserAgent } from "utils/getUserAgent"

export const metaphysicsUrlMiddleware = () => {
  return urlMiddleware({
    url: () => {
      const metaphysicsUrl = unsafe__getEnvironment().strings.metaphysicsURL
      return metaphysicsUrl
    },
    headers: () => {
      const userAgent = getUserAgent()
      const { userID } = unsafe__getAuth()
      return {
        "Content-Type": "application/json",
        "User-Agent": userAgent,
        "X-USER-ID": userID as string,
        "X-TIMEZONE": "Europe/Berlin",
      }
    },
  })
}
