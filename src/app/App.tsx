import { Main } from "app/Navigation"
import { Providers } from "app/Providers"
import { setupFlipper } from "app/system/devTools/flipper"
import { ignoreLogs } from "app/system/devTools/ignoreLogs"

setupFlipper()
ignoreLogs()

export const App = () => (
  <Providers>
    <Main />
  </Providers>
)
