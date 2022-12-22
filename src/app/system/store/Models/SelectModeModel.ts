import { action, Action, computed, Thunk, Computed, thunk } from "easy-peasy"

type ItemType = "artwork" | "install" | "document"

export interface SelectModeModel {
  // state
  isActive: boolean
  artworks: Array<string>
  installs: Array<string>
  documents: Array<string>
  items: Computed<this, Array<{ type: ItemType; item: string }>>

  // code actions
  toggleSelectMode: Thunk<this>
  cancelSelectMode: Thunk<this>
  toggleSelectedItem: Action<this, { type: ItemType; item: string }>
  setSelectedItems: Action<this, { type: ItemType; items: Array<string> }>

  // supporting actions
  setSelectMode: Action<this, this["isActive"]>
  clearSelectedItems: Action<this>
}

export const getSelectModeModel = (): SelectModeModel => ({
  isActive: false,
  artworks: [],
  installs: [],
  documents: [],
  items: computed((state) => [
    ...state.artworks.map((a): { type: ItemType; item: string } => ({ type: "artwork", item: a })),
    ...state.installs.map((i): { type: ItemType; item: string } => ({ type: "install", item: i })),
    ...state.documents.map((d): { type: ItemType; item: string } => ({
      type: "document",
      item: d,
    })),
  ]),

  toggleSelectMode: thunk((actions, _, { getState }) => {
    const newValue = !getState().isActive
    actions.setSelectMode(newValue)
    if (newValue === false) {
      actions.clearSelectedItems()
    }
  }),
  cancelSelectMode: thunk((actions) => {
    actions.setSelectMode(false)
    actions.clearSelectedItems()
  }),
  toggleSelectedItem: action((state, { type, item }) => {
    const arrayToLookAt = findStateArrayByType(type)
    if (state[arrayToLookAt].includes(item)) {
      state[arrayToLookAt] = state[arrayToLookAt].filter((i) => i !== item)
    } else {
      state[arrayToLookAt].push(item)
    }
  }),
  setSelectedItems: action((state, { type, items }) => {
    const arrayToLookAt = findStateArrayByType(type)
    state[arrayToLookAt] = items
  }),

  setSelectMode: action((state, value) => {
    state.isActive = value
  }),
  clearSelectedItems: action((state) => {
    state.artworks = []
    state.installs = []
    state.documents = []
  }),
})

function findStateArrayByType(type: ItemType) {
  let arrayToLookAt: Extract<keyof SelectModeModel, "artworks" | "installs" | "documents">
  switch (type) {
    case "artwork":
      arrayToLookAt = "artworks"
      break
    case "install":
      arrayToLookAt = "installs"
      break
    case "document":
      arrayToLookAt = "documents"
      break
    default:
      assertNever(type)
  }
  return arrayToLookAt
}
