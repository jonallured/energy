import {
  ActionType,
  AuthModalType,
  ContextModule,
  Intent,
  SuccessfullyLoggedIn,
} from "@artsy/cohesion"
import { useTracking } from "react-tracking"

export const useFolioTracking = () => {
  const { trackEvent } = useTracking()

  return {
    trackLoginSuccess: (userId: string) => {
      const payload: SuccessfullyLoggedIn = {
        action: ActionType.successfullyLoggedIn,
        // what should go here?
        auth_redirect: "",
        // shouldn't this use AuthContextModule?
        context_module: ContextModule.header,
        intent: Intent.login,
        service: "email",
        // ok to use click and not tap?
        trigger: "click",
        type: AuthModalType.login,
        user_id: userId,
      }
      trackEvent(payload)
    },
  }
}
