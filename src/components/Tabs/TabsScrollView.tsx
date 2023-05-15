import { useListenForTabContentScroll } from "components/Tabs/useListenForTabContentScroll"
import { ScrollViewProps } from "react-native"
import { Tabs } from "react-native-collapsible-tab-view"

export const TabsScrollView = (props: ScrollViewProps) => {
  useListenForTabContentScroll()

  return (
    /*// @ts-ignore */
    <Tabs.ScrollView
      // See: https://github.com/PedroBern/react-native-collapsible-tab-view/issues/158
      {...props}
    />
  )
}
