import { isAllSelected, SelectMode } from "components/SelectMode/SelectMode"
import { GlobalStore } from "system/store/GlobalStore"

export const SelectModeActions: React.FC = () => {
  const { activeTab, activeTabItems } = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState
  )

  const selectedItems = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.selectedItems
  )

  const allSelected = isAllSelected(selectedItems, activeTabItems)
  const enabled = activeTabItems.length > 0

  return (
    <SelectMode
      enabled={enabled}
      activeTab={activeTab}
      allSelected={allSelected}
      selectAll={() => {
        GlobalStore.actions.selectMode.selectItems(activeTabItems)
      }}
      unselectAll={() => {
        GlobalStore.actions.selectMode.clearSelectedItems()
      }}
    />
  )
}
