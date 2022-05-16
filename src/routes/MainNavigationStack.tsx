import { HomeTabs } from "Screens/HomeTabs/HomeTabs"
import { LoginScreen } from "Screens/Login/Login"
import { GlobalStore } from "store/GlobalStore"
import { useStoreRehydrated } from "easy-peasy"
import React, { useEffect } from "react"

// tslint:disable-next-line:interface-over-type-literal
export type MainNavigationStack = {
  Home: undefined
  Login: undefined
}

export const MainNavigationStack = () => {
  const isRehydrated = useStoreRehydrated()
  const isLoggedIn = !!GlobalStore.useAppState((store) => store.auth.userAccessToken)

  useEffect(() => {
    console.log("islogged in", isLoggedIn)

    return () => {}
  }, [isLoggedIn])

  if (!isRehydrated) {
    return null
  }

  if (!isLoggedIn) {
    return <LoginScreen />
  }

  return <HomeTabs />
}
