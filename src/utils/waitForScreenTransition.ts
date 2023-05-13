import { SCREEN_TRANSITION_TIME } from "@artsy/palette-mobile"

export const waitForScreenTransition = (callback: () => void) => {
  setTimeout(callback, SCREEN_TRANSITION_TIME)
}
