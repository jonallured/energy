import { action, Action, computed, Thunk, Computed, thunk } from "easy-peasy"

type ItemType = "artwork" | "install" | "document"

export interface SelectModeModel {
  sessionState: {
    isActive: boolean
    artworks: Array<string>
    installs: Array<string>
    documents: Array<string>
    items: Computed<SelectModeModel["sessionState"], Array<{ type: ItemType; item: string }>>

    selectModeAllSelected: boolean
  }

  // code actions
  toggleSelectMode: Thunk<this>
  cancelSelectMode: Thunk<this>
  toggleSelectedItem: Action<this, { type: ItemType; item: string }>
  setSelectedItems: Action<this, { type: ItemType; items: Array<string> }>

  // supporting actions
  setSelectMode: Action<this, this["sessionState"]["isActive"]>
  clearSelectedItems: Action<this>

  // TODO
  selectModeSelectAll: Action<this>
  selectModeUnselectAll: Action<this>
}

export const getSelectModeModel = (): SelectModeModel => ({
  sessionState: {
    // TODO: audit, as related to isActive below
    selectModeAllSelected: false,

    isActive: false,
    artworks: [],
    installs: [],
    documents: [],
    items: computed((state) => {
      return [
        ...state.artworks.map((artwork): { type: ItemType; item: string } => ({
          type: "artwork",
          item: artwork,
        })),
        ...state.installs.map((installShot): { type: ItemType; item: string } => ({
          type: "install",
          item: installShot,
        })),
        ...state.documents.map((document): { type: ItemType; item: string } => ({
          type: "document",
          item: document,
        })),
      ]
    }),
  },

  toggleSelectMode: thunk((actions, _, { getState }) => {
    const newValue = !getState().sessionState.isActive
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
    if (state.sessionState[arrayToLookAt].includes(item)) {
      state.sessionState[arrayToLookAt] = state.sessionState[arrayToLookAt].filter(
        (i) => i !== item
      )
    } else {
      state.sessionState[arrayToLookAt].push(item)
    }
  }),
  setSelectedItems: action((state, { type, items }) => {
    const arrayToLookAt = findStateArrayByType(type)
    console.log("umm", arrayToLookAt)
    state.sessionState[arrayToLookAt] = items
  }),

  setSelectMode: action((state, value) => {
    state.sessionState.isActive = value
  }),
  clearSelectedItems: action((state) => {
    state.sessionState.artworks = []
    state.sessionState.installs = []
    state.sessionState.documents = []
  }),

  // TODO: Audit
  selectModeSelectAll: action((state) => {
    state.sessionState.selectModeAllSelected = true
  }),
  selectModeUnselectAll: action((state) => {
    state.sessionState.selectModeAllSelected = false
  }),
})

function findStateArrayByType(type: ItemType) {
  let arrayToLookAt: Extract<
    keyof SelectModeModel["sessionState"],
    "artworks" | "installs" | "documents"
  >
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
