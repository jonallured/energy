import { NAVBAR_HEIGHT } from "components/Screen/constants"
import { TabsContext } from "components/Tabs/TabsContext"
import { useEffect, useState } from "react"
import { useCurrentTabScrollY } from "react-native-collapsible-tab-view"
import { SharedValue, useAnimatedReaction, useSharedValue } from "react-native-reanimated"

export const useListenForTabContentScroll = () => {
  const scrollY = useAnimatedHeaderScrolling(useCurrentTabScrollY())
  const updateCurrentScrollY = TabsContext.useStoreActions(
    (actions) => actions.updateCurrentScrollY
  )

  useEffect(() => {
    updateCurrentScrollY(scrollY)
  }, [scrollY, updateCurrentScrollY])
}

const useAnimatedHeaderScrolling = (scrollY: SharedValue<number>) => {
  const listenForScroll = useSharedValue(true)
  const [currScrollY, setCurrScrollY] = useState(scrollY.value)

  useEffect(() => {
    const timer = setTimeout(() => {
      listenForScroll.value = false
    }, 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [listenForScroll])

  useAnimatedReaction(
    () => [scrollY.value, listenForScroll.value] as const,
    ([animatedScrollY, isListeningForScroll], previousScroll) => {
      const [prevScrollY] = previousScroll ?? [0, false]

      // Hacky way to avoid some weird header behavior.
      // look at HACKS.md for more info.
      const suddenlyScrolled = Math.abs(animatedScrollY - prevScrollY) > NAVBAR_HEIGHT

      if (isListeningForScroll && suddenlyScrolled) {
        return
      }

      setCurrScrollY(Math.floor(scrollY.value))
    },
    [scrollY]
  )

  return currScrollY
}