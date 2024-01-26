import { Main } from "Navigation"
import { Providers } from "Providers"
import codePush from "react-native-code-push"
import { codePushOptions } from "system/codepush"
import { AsyncStorageDevtools } from "system/devTools/AsyncStorageDevtools"
import { setupFlipper } from "system/devTools/flipper"
import { ignoreLogs } from "system/devTools/ignoreLogs"

setupFlipper()
ignoreLogs()

// ts-prune-ignore-next
const InnerApp = () => {
  return (
    <>
      <AsyncStorageDevtools />

      <Providers>
        <Main />
      </Providers>
    </>
  )
}

export const App = __DEV__ ? InnerApp : codePush(codePushOptions)(InnerApp)
