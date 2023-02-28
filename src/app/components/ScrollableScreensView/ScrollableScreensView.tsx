import { ScrollableLazyScreen } from "app/components/ScrollableScreensView/ScrollableLazyScreen"
import {
  ScrollableScreenEntity,
  ScrollableScreensContextValue,
  ScrollableScreensContext,
} from "app/components/ScrollableScreensView/ScrollableScreensContext"
import { useState } from "react"
import { StyleSheet, View } from "react-native"
import PagerView from "react-native-pager-view"
import { NativeProps as PagerViewNativeProps } from "react-native-pager-view/lib/typescript/PagerViewNativeComponent"

interface ScrollableScreensViewProps {
  screens: ScrollableScreenEntity[]
  initialScreenName?: string
  prefetchScreensCount?: number
}

export const ScrollableScreensView: React.FC<ScrollableScreensViewProps> = (props) => {
  const { screens, initialScreenName, prefetchScreensCount = 1 } = props
  const [activeScreenIndex, setActiveScreenIndex] = useState(
    initialScreenName ? screens.findIndex((screen) => screen.name === initialScreenName) : 0
  )

  const context: ScrollableScreensContextValue = {
    activeScreenIndex,
    activeScreen: screens[activeScreenIndex],
  }

  const handlePageSelected: PagerViewNativeProps["onPageSelected"] = (event) => {
    setActiveScreenIndex(event.nativeEvent.position)
  }

  return (
    <ScrollableScreensContext.Provider value={context}>
      <PagerView
        style={styles.container}
        overScrollMode="never"
        onPageSelected={handlePageSelected}
        initialPage={activeScreenIndex}
      >
        {screens.map((screen, screenIndex) => {
          const shouldRender = Math.abs(activeScreenIndex - screenIndex) <= prefetchScreensCount

          return (
            <View style={styles.page} key={screen.name}>
              <ScrollableLazyScreen screen={screen} shouldRender={shouldRender} />
            </View>
          )
        })}
      </PagerView>
    </ScrollableScreensContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    width: "100%",
    height: "100%",
  },
})
