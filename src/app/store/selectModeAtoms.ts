import { atom, useAtom } from "jotai"
import { noop } from "lodash"
import { useEffect } from "react"
import { useFocusedTab } from "react-native-collapsible-tab-view"
import { GlobalStore } from "./GlobalStore"

export const allSelectedAtom = atom(false)
export const selectAllAtom = atom<(() => void) | null>(null)
export const unselectAllAtom = atom<(() => void) | null>(null)

export interface SelectModeConfig {
  selectModeActive: boolean
  selectModeToggle: () => void
  selectModeAllSelected: boolean
  selectModeSelectAll: () => void
  selectModeUnselectAll: () => void
}

export function useHeaderSelectModeConfig(): SelectModeConfig {
  const isSelectModeActive = GlobalStore.useAppState((state) => state.selectMode.isSelectModeActive)
  const toggle = () => GlobalStore.actions.selectMode.toggleSelectMode()
  const [allSelected] = useAtom(allSelectedAtom)
  const [selectAllFn] = useAtom(selectAllAtom)
  const [unselectAllFn] = useAtom(unselectAllAtom)

  return {
    selectModeActive: isSelectModeActive,
    selectModeToggle: toggle,
    selectModeAllSelected: allSelected,
    selectModeSelectAll: selectAllFn ?? noop,
    selectModeUnselectAll: unselectAllFn ?? noop,
  }
}

export function useHeaderSelectModeInTab(
  tabName: string,
  {
    allSelected,
    selectAllFn,
    unselectAllFn,
  }: {
    allSelected: boolean
    selectAllFn: () => void
    unselectAllFn: () => void
  }
): void {
  const t = useFocusedTab()

  const [, setAllSelected] = useAtom(allSelectedAtom)
  useEffect(() => {
    if (t !== tabName) return

    setAllSelected(allSelected)
  }, [t, tabName, allSelected])

  const [, setSelectAllFn] = useAtom(selectAllAtom)
  const [, setUnselectAllFn] = useAtom(unselectAllAtom)
  useEffect(() => {
    if (t !== tabName) return

    setSelectAllFn(() => selectAllFn)
    setUnselectAllFn(() => unselectAllFn)
  }, [t, tabName])
}
