import { createEnvironment } from "./createEnvironment"
import { _setDefaultEnvironment } from "./defaultEnvironent"

export const resetEnvironment = () => {
  _setDefaultEnvironment(createEnvironment())
}
