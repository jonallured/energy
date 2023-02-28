import { GlobalStore, unsafe__getEnvironment } from "app/system/store/GlobalStore"
import { Alert } from "react-native"
import { Middleware } from "react-relay-network-modern/node8"

let willShowAlert = false

// This middleware is responsible of signing the user out if their session expired
export const checkAuthenticationMiddleware = (): Middleware => {
  return (next) => async (req) => {
    const res = await next(req)
    const authenticationToken = req.fetchOpts.headers["X-ACCESS-TOKEN"]
    // authenticationToken can be `undefined` if the user was logged out *just* before this request was executed
    if (res.errors?.length && authenticationToken) {
      const { gravityURL } = unsafe__getEnvironment().strings
      try {
        const result = await fetch(`${gravityURL}/api/v1/me`, {
          method: "HEAD",
          headers: { "X-ACCESS-TOKEN": authenticationToken },
        })
        if (result.status === 401) {
          await GlobalStore.actions.auth.signOut()
          // Requests are not necessarily executed sequentially so we need to check that another request
          // didn't make it here already while we were awaiting.
          if (willShowAlert) {
            return res
          }
          willShowAlert = true
          // There is a race condition that prevents the onboarding slideshow from starting if we call an Alert
          // here synchronously, so we need to wait a few ticks.
          setTimeout(() => {
            Alert.alert("Session expired", "Please log in to continue.")
            willShowAlert = false
          }, 200)
        }
      } catch (e) {
        if (__DEV__) {
          console.error(e)
        }
        // network problem
        Alert.alert("Network unavailable", "Please check your connection.")
      }
    }
    return res
  }
}
