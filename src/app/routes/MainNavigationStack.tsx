import { LoginScreen } from "app/screens/Auth/Login"
import { GlobalStore } from "app/store/GlobalStore"
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
