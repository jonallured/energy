import { getEnvironmentModel, EnvironmentModel } from "./EnvironmentModel"

interface ConfigModelState {
  environment: EnvironmentModel
}

export type ConfigModel = ConfigModelState

export const getConfigModel = (): ConfigModel => ({
  environment: getEnvironmentModel(),
})
