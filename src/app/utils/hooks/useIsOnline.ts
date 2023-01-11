import { GlobalStore } from "app/system/store/GlobalStore"

export const useIsOnline = () => {
  const isOnline = GlobalStore.useAppState((state) => state.networkStatus.isOnline)
  return isOnline
}
