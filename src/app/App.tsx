import { LogBox } from "react-native"
import { Main } from "app/Navigation"
import { AppProviders } from "app/Providers"
import { setupFlipper } from "app/system/devTools/flipper"

setupFlipper()

LogBox.ignoreLogs(["lineHeight", "borderRadius", "fontSize", "onBackground", "borderWidth"])

export const App = () => (
  <AppProviders>
    <Main />
  </AppProviders>
)
