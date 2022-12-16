import { LogBox } from "react-native"
import { AppProviders } from "./AppProviders"
import { Main } from "./navigation/Main"
import { setupFlipper } from "./system/flipper"

setupFlipper()

LogBox.ignoreLogs(["lineHeight", "borderRadius", "fontSize", "onBackground", "borderWidth"])

export const App = () => {
  return (
    <AppProviders>
      <Main />
    </AppProviders>
  )
}
