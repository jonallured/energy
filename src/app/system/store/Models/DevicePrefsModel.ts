import { action, Action, computed, Computed } from "easy-peasy"
import { DateTime } from "luxon"
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

  // dev menu
  showDevMenuButton: Computed<this, boolean, GlobalStoreModel>
  showDevMenuButtonInternalToggle: boolean
  setShowDevMenuButton: Action<this, this["showDevMenuButtonInternalToggle"]>

  lastSync: string | null
  setLastSync: Action<this, DateTime | null>
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

  showDevMenuButton: computed([(_, store) => store], (store) => {
    return (
      (__DEV__ || store.artsyPrefs.isUserDev) && store.devicePrefs.showDevMenuButtonInternalToggle
    )
  }),
  showDevMenuButtonInternalToggle: false,
  setShowDevMenuButton: action((state, option) => {
    state.showDevMenuButtonInternalToggle = option
  }),

  lastSync: null,
  setLastSync: action((state, timestamp) => {
    if (timestamp === null) {
      state.lastSync = null
    } else {
      state.lastSync = timestamp.toISO()
    }
  }),
})
