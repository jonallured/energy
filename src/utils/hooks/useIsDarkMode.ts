import { GlobalStore } from "system/store/GlobalStore"

export const useIsDarkMode = () => {
  const isDarkMode = GlobalStore.useAppState(
    (state) => state.devicePrefs.colorScheme === "dark"
  )
  return isDarkMode
}
