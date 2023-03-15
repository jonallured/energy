import { useListenForTabContentScroll } from "components/Tabs/useListenForTabContentScroll"
import { ScrollViewProps } from "react-native"
import { Tabs } from "react-native-collapsible-tab-view"

export const TabsScrollView: React.FC<ScrollViewProps> = (props) => {
  useListenForTabContentScroll()

  return (
    <Tabs.ScrollView
      // See: https://github.com/PedroBern/react-native-collapsible-tab-view/issues/158
      accessibilityComponentType={undefined}
      accessibilityTraits={undefined}
      {...props}
    />
  )
}
