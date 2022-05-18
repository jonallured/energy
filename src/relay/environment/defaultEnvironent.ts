import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { createEnvironment } from "./createEnvironment"

export let defaultEnvironment = createEnvironment()

export const _setDefaultEnvironment = (newEnv: RelayModernEnvironment) => {
  defaultEnvironment = newEnv
}
