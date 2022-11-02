import { useRoute } from "@react-navigation/native"
import { runOnJS, SharedValue, useAnimatedReaction } from "react-native-reanimated"
import { useAnimatedTitleSmallTitleShownSetter } from "./atoms"

export function useAnimatedHeaderScrolling(scrollY: SharedValue<number>, useHack = false) {
  const setTitleShown = useAnimatedTitleSmallTitleShownSetter()

  useAnimatedReaction(
    () => scrollY.value,
    (data, prevData) => {
      // hacky way to avoid some weird header behavior.
      // look at HACKS.md for more info.
      const suddenlyScrolled = Math.abs(data - (prevData ?? 0)) > 40
      if (useHack && suddenlyScrolled) return

      // don't trigger the toggle function if the value we call it with hasn't changed
      const prevTitleShown = (prevData ?? 0) > 30
      const currTitleShown = (data ?? 0) > 30
      if (prevTitleShown === currTitleShown) return

      runOnJS(setTitleShown)(data > 30)
    },
    [scrollY]
  )
}

export const useScreenName = (): string => {
  const { name: screenName } = useRoute()
  return screenName
}
