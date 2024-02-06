import { GlobalStore } from "system/store/GlobalStore"

export const useSelectedItems = () => {
  const selectedItems = GlobalStore.useAppState(
    (state) => state.selectMode.sessionState.selectedItems
  )

  return {
    selectedItems,
  }
}
