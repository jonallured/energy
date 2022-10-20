import { useRoute } from "@react-navigation/native"
import { runOnJS, SharedValue, useAnimatedReaction } from "react-native-reanimated"
import { useAnimatedTitleSmallTitleShownSetter } from "./atoms"

export type Header = "none" | "regular" | "floating" | "raw-safe" | "raw-nosafe" | "animated-title"

export const useAnimatedHeaderScrolling = (scrollY: SharedValue<number>, useHack = false) => {
  const setTitleShown = useAnimatedTitleSmallTitleShownSetter()

  useAnimatedReaction(
    () => scrollY.value,
    (data, prevData) => {
      // hacky way to avoid some weird header behavior.
      // look at HACKS.md for more info.
      if (useHack && Math.abs(data - (prevData ?? 0)) > 40) return

      runOnJS(setTitleShown)(data > 30)
    },
    [scrollY]
  )
}

export const useScreenName = (): string => {
  const { name: screenName } = useRoute()
  return screenName
}
