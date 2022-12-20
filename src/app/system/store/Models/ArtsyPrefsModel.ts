import { action, Action } from "easy-peasy"

export interface ArtsyPrefsModel {
  isUserDev: boolean
  switchIsUserDev: Action<this>
}

export const getArtsyPrefsModel = (): ArtsyPrefsModel => ({
  isUserDev: false,
  switchIsUserDev: action((state) => {
    state.isUserDev = !state.isUserDev
  }),
})
