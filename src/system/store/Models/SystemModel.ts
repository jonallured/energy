import { action, Action } from "easy-peasy"

export interface SystemModel {
  sessionState: {
    isDonePerformingMigrations: boolean
    navigationHistory: { [key: string]: [string, object | undefined] }
  }

  saveNavigationHistory: Action<
    this,
    { lookupKey: string; navigationState: [string, object | undefined] }
  >
  deleteNavigationHistory: Action<this, string>
}

export const getSystemModel = (): SystemModel => ({
  sessionState: {
    isDonePerformingMigrations: false,
    navigationHistory: {},
  },

  saveNavigationHistory: action((state, { lookupKey, navigationState }) => {
    state.sessionState.navigationHistory[lookupKey] = navigationState
  }),

  deleteNavigationHistory: action((state, lookupKey) => {
    delete state.sessionState.navigationHistory[lookupKey]
  }),
})