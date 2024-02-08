import { Action, action, createContextStore } from "easy-peasy"

export type Filters = "All" | "Albums" | "Artists" | "Shows"

interface SearchContextStore {
  disabledFilters: Filters[]
  currentFilter: Filters | null
  selectFilter: Action<this, Filters | null>
  disableFilters: Action<this, Filters[]>
}

export const SearchContext = createContextStore<SearchContextStore>({
  disabledFilters: ["Albums", "Artists", "Shows", "All"],
  currentFilter: "All",

  disableFilters: action((state, filters) => {
    state.disabledFilters = filters
  }),

  selectFilter: action((state, filter) => {
    state.currentFilter = filter
  }),
})
