import { Portal } from "components/Portal"
import { isAllSelected, SelectMode } from "components/SelectMode"
import { useFocusedTab } from "react-native-collapsible-tab-view"
import { GlobalStore } from "system/store/GlobalStore"
import { SelectedItem } from "system/store/Models/SelectModeModel"

interface SelectModePortalProps {
  tabName: string
  items: SelectedItem[]
}

export const SelectModePortal: React.FC<SelectModePortalProps> = ({
  tabName,
  items,
}) => {
  const selectedItems = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.selectedItems
  )

  const allSelected = isAllSelected(selectedItems, items)
  const activeTab = useFocusedTab()

  return (
    <Portal active={tabName === activeTab}>
      <SelectMode
        activeTab={activeTab}
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
