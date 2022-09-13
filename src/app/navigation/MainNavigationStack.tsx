import { useStoreRehydrated } from "easy-peasy"
import { LoginScreen } from "app/screens/Auth/Login"
import { useWebViewCookies } from "app/sharedUI/screens/Artwork/ArtworkWebView"
import { GlobalStore } from "app/store/GlobalStore"
import { HomeTabsNavigationStack } from "./HomeTabsNavigationStack"

export const MainNavigationStack = () => {
  const isRehydrated = useStoreRehydrated()
  const isLoggedIn = !!GlobalStore.useAppState((store) => store.auth.userAccessToken)

  useWebViewCookies()

  if (!isRehydrated) {
    return null
  }

  if (!isLoggedIn) {
    return <LoginScreen />
  }

  return <HomeTabsNavigationStack />
}
