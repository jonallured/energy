import { useListenForTabContentScroll } from "components/Tabs/useListenForTabContentScroll"
import { FlatListProps } from "react-native"
import { Tabs } from "react-native-collapsible-tab-view"

export const TabsFlatList: React.FC<FlatListProps<any>> = (props) => {
  useListenForTabContentScroll()

  return <Tabs.FlatList {...props} />
}
