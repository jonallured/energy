import { action, Action } from "easy-peasy"

export interface SystemModel {
  sessionState: {
    navigationHistory: { [key: string]: [string, object | undefined] }
  }

  launchCount: number

  incrementLaunchCount: Action<this>

  saveNavigationHistory: Action<
    this,
    { lookupKey: string; navigationState: [string, object | undefined] }
  >
  deleteNavigationHistory: Action<this, string>
}

export const getSystemModel = (): SystemModel => ({
  sessionState: {
    navigationHistory: {},
  },

  launchCount: 0,

  incrementLaunchCount: action((state) => {
    state.launchCount += 1
  }),

  saveNavigationHistory: action((state, { lookupKey, navigationState }) => {
    state.sessionState.navigationHistory[lookupKey] = navigationState
  }),

  deleteNavigationHistory: action((state, lookupKey) => {
    delete state.sessionState.navigationHistory[lookupKey]
  }),
})
