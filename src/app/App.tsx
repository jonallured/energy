import { LogBox } from "react-native"
import { AppProviders } from "./AppProviders"
import { Main } from "./navigation/Main"

LogBox.ignoreLogs(["lineHeight", "borderRadius", "fontSize", "onBackground", "borderWidth"])

export const App = () => (
  <AppProviders>
    <Main />
  </AppProviders>
)
