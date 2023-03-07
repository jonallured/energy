import { Portal } from "app/components/Portal"
import { isAllSelected, SelectMode } from "app/components/SelectMode"
import { GlobalStore } from "app/system/store/GlobalStore"
import { SelectedItem } from "app/system/store/Models/SelectModeModel"
import { useFocusedTab } from "react-native-collapsible-tab-view"

interface SelectModePortalProps {
  tabName: string
  items: SelectedItem[]
}

export const SelectModePortal: React.FC<SelectModePortalProps> = ({ tabName, items }) => {
  const selectedItems = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.selectedItems
  )

  const allSelected = isAllSelected(selectedItems, items)
  const activeTab = useFocusedTab()

  return (
    <Portal active={tabName === activeTab}>
      <SelectMode
        allSelected={allSelected}
        selectAll={() => {
          GlobalStore.actions.selectMode.selectItems(items)
        }}
        unselectAll={() => {
          GlobalStore.actions.selectMode.clearSelectedItems()
        }}
      />
    </Portal>
  )
}
