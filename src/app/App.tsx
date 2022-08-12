import { LogBox } from "react-native"
import { AppProviders } from "./AppProviders"
import { MainNavigationStack } from "./navigation/MainNavigationStack"

LogBox.ignoreLogs(["Expected style "])

export const App = () => (
  <AppProviders>
    <MainNavigationStack />
  </AppProviders>
)
