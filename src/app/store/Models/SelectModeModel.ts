import { action, Action } from "easy-peasy"

type ItemType = "works" | "documents"

export interface SelectModeModel {
  isSelectModeActive: boolean
  items: Record<ItemType, string[]>
  toggleSelectMode: Action<this>
  cancelSelectMode: Action<this>
  selectItem: Action<this, { itemType: ItemType; item: string }>
  selectAllItems: Action<this, { itemType: ItemType; allItems: string[] }>
}

export const getSelectModeModel = (): SelectModeModel => ({
  isSelectModeActive: false,
  items: { works: [], documents: [] },
  toggleSelectMode: action((state) => {
    state.isSelectModeActive = !state.isSelectModeActive
    if (state.isSelectModeActive === false) {
      state.items.works = []
      state.items.documents = []
    }
  }),
  cancelSelectMode: action((state) => {
    state.isSelectModeActive = false
    state.items.works = []
    state.items.documents = []
  }),
  selectItem: action((state, { itemType, item }) => {
    if (!state.items[itemType].includes(item)) {
      state.items[itemType].push(item)
    } else {
      state.items[itemType] = state.items[itemType].filter((i) => i !== item)
    }
  }),
  selectAllItems: action((state, { itemType, allItems }) => {
    state.items[itemType] = allItems
  }),
})
