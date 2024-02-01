import { GlobalStore } from "system/store/GlobalStore"

export const useIsOnline = () => {
  const isOnline = GlobalStore.useAppState(
    (state) => state.networkStatus.isOnline
  )
  return isOnline
}
