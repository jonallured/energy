import { Action, action, createContextStore } from "easy-peasy"

export type Filters = "All" | "Albums" | "Artists" | "Shows"

interface TabsContextStore {
  currentScrollY: number
  updateCurrentScrollY: Action<this, number>
}

export const TabsContext = createContextStore<TabsContextStore>({
  currentScrollY: 0,

  updateCurrentScrollY: action((state, currentScrollY) => {
    state.currentScrollY = currentScrollY
  }),
})
