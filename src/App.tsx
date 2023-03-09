import { Main } from "Navigation"
import { Providers } from "Providers"
import { AsyncStorageDevtools } from "system/devTools/AsyncStorageDevtools"
import { setupFlipper } from "system/devTools/flipper"
import { ignoreLogs } from "system/devTools/ignoreLogs"

setupFlipper()
ignoreLogs()

// ts-prune-ignore-next
export const App = () => (
  <>
    <AsyncStorageDevtools />

    <Providers>
      <Main />
    </Providers>
  </>
)
