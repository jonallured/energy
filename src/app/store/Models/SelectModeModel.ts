import { action, Action } from "easy-peasy"

export interface SelectModeModel {
  isSelectModeActive: boolean
  toggleSelectMode: Action<this>
}

export const getSelectModeModel = (): SelectModeModel => ({
  isSelectModeActive: false,
  toggleSelectMode: action((state) => {
    state.isSelectModeActive = !state.isSelectModeActive
  }),
})
