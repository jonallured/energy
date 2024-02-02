import { setGlobalActiveOpacity } from "@artsy/palette-mobile"
import { Boot } from "Boot"
import { Main } from "Navigation"
import codePush from "react-native-code-push"
import { codePushOptions } from "system/codepush"
import { AsyncStorageDevtools } from "system/devTools/AsyncStorageDevtools"
import { setupFlipper } from "system/devTools/flipper"
import { ignoreLogs } from "system/devTools/ignoreLogs"

setupFlipper()
ignoreLogs()
setGlobalActiveOpacity(0.5)

// ts-prune-ignore-next
const InnerApp = () => {
  return (
    <>
      <AsyncStorageDevtools />

      <Boot>
        <Main />
      </Boot>
    </>
  )
}

export const App = __DEV__ ? InnerApp : codePush(codePushOptions)(InnerApp)
