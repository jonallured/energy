import { action, Action, computed, Computed } from "easy-peasy"
import { Appearance } from "react-native"
import { GlobalStoreModel } from "./GlobalStoreModel"

export interface DevicePrefsModel {
  // color scheme
  colorScheme: Computed<this, "light" | "dark", GlobalStoreModel>
  usingSystemColorScheme: boolean

  forcedColorScheme: "light" | "dark"
  systemColorScheme: "light" | "dark"

  setSystemColorScheme: Action<this, this["systemColorScheme"]>
  setUsingSystemColorScheme: Action<this, this["usingSystemColorScheme"]>
  setForcedColorScheme: Action<this, this["forcedColorScheme"]>

  // temp color scheme stuff
  overrides: Record<string, any>
  setOverrides: Action<this, Partial<this["overrides"]>>
}

export const getDevicePrefsModel = (): DevicePrefsModel => ({
  colorScheme: computed([(_, store) => store], (store) =>
    store.devicePrefs.usingSystemColorScheme
      ? store.devicePrefs.systemColorScheme
      : store.devicePrefs.forcedColorScheme
  ),
  usingSystemColorScheme: false,
  forcedColorScheme: "light",
  systemColorScheme: Appearance.getColorScheme() ?? "light",

  setSystemColorScheme: action((state, scheme) => {
    state.systemColorScheme = scheme
  }),
  setUsingSystemColorScheme: action((state, option) => {
    state.usingSystemColorScheme = option
  }),
  setForcedColorScheme: action((state, option) => {
    state.forcedColorScheme = option
  }),

  overrides: { background: "#000" },
  setOverrides: action((state, newOverrides) => {
    state.overrides = { ...state.overrides, ...newOverrides }
  }),
})
