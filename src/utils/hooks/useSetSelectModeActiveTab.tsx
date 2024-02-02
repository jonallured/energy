import { ScreenNames } from "Navigation"
import { useEffect } from "react"
import { useFocusedTab } from "react-native-collapsible-tab-view"
import { GlobalStore } from "system/store/GlobalStore"
import { SelectedItem } from "system/store/Models/SelectModeModel"
import { useIsScreenVisible } from "utils/hooks/useIsScreenVisible"

interface UseActiveTabProps {
  name: ScreenNames
  items?: SelectedItem[]
}

export const useSetSelectModeActiveTab = ({
  name,
  items = [],
}: UseActiveTabProps) => {
  const isScreenVisible = useIsScreenVisible(name)
  const activeTab = useFocusedTab()

  useEffect(() => {
    if (isScreenVisible) {
      if (activeTab === name) {
        GlobalStore.actions.selectMode.setActiveTab({
          activeTab: name,
          activeTabItems: items,
        })
      }
    }
  }, [isScreenVisible, activeTab])
}
