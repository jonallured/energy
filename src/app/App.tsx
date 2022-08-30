import { useEffect } from "react"
import { LogBox } from "react-native"
import SplashScreen from "react-native-splash-screen"
import { AppProviders } from "./AppProviders"
import { MainNavigationStack } from "./navigation/MainNavigationStack"

LogBox.ignoreLogs(["Expected style "])

export const App = () => {
  useEffect(() => {
    SplashScreen.hide()
  }, [])

  return (
    <AppProviders>
      <MainNavigationStack />
    </AppProviders>
  )
}
