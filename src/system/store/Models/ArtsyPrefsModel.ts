import { action, Action } from "easy-peasy"

export interface ArtsyPrefsModel {
  isUserDev: boolean
  isAnalyticsVisualizerEnabled: boolean
  toggleAnalyticsVisualizer: Action<this>
  switchIsUserDev: Action<this>
}

export const getArtsyPrefsModel = (): ArtsyPrefsModel => ({
  isUserDev: false,
  isAnalyticsVisualizerEnabled: false,

  toggleAnalyticsVisualizer: action((state) => {
    state.isAnalyticsVisualizerEnabled = !state.isAnalyticsVisualizerEnabled
  }),

  switchIsUserDev: action((state) => {
    state.isUserDev = !state.isUserDev
  }),
})
