import { LoginScreen } from "Screens/Login/Login"
import { GlobalStore } from "store/GlobalStore"
import { useStoreRehydrated } from "easy-peasy"
import { HomeTabsNavigationStack } from "./HomeTabsNavigationStack"

export const MainNavigationStack = () => {
  const isRehydrated = useStoreRehydrated()
  const isLoggedIn = !!GlobalStore.useAppState((store) => store.auth.userAccessToken)

  if (!isRehydrated) {
    return null
  }

  if (!isLoggedIn) {
    return <LoginScreen />
  }

  return <HomeTabsNavigationStack />
}
