import { SCREEN_TRANSITION_TIME } from "components/Screen/constants"

export const waitForScreenTransition = (callback: () => void) => {
  setTimeout(callback, SCREEN_TRANSITION_TIME)
}
