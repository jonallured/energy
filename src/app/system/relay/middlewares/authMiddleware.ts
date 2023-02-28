import { unsafe__getAuth } from "app/system/store/GlobalStore"
import { authMiddleware as defaultAuthMiddleware } from "react-relay-network-modern/node8"

export const authMiddleware = () =>
  defaultAuthMiddleware({
    token: () => {
      const { userAccessToken } = unsafe__getAuth()
      return userAccessToken || ""
    },
    header: "X-ACCESS-TOKEN",
    prefix: "", // No prefix is needed
  })
