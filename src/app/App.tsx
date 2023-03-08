import { Main } from "app/Navigation"
import { Providers } from "app/Providers"
import { AsyncStorageDevtools } from "app/system/devTools/AsyncStorageDevtools"
import { setupFlipper } from "app/system/devTools/flipper"
import { ignoreLogs } from "app/system/devTools/ignoreLogs"

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
