import { Action, computed, Computed, action } from "easy-peasy"

type Environment = "staging" | "production"

interface EnvironmentOptionDescriptor {
  readonly description: string
  readonly presets: { readonly [k in Environment]: string }
}

// helper to get good typings and intellisense
function defineEnvironmentOptions<EnvOptionName extends string>(options: {
  readonly [k in EnvOptionName]: EnvironmentOptionDescriptor
}) {
  return options
}

export const environmentOptions = defineEnvironmentOptions({
  gravityURL: {
    description: "Gravity URL",
    presets: {
      staging: "https://stagingapi.artsy.net",
      production: "https://api.artsy.net",
    },
  },
  metaphysicsURL: {
    description: "Metaphysics URL",
    presets: {
      staging: "https://metaphysics-staging.artsy.net/v2",
      production: "https://metaphysics-production.artsy.net/v2",
    },
  },
  predictionURL: {
    description: "Prediction URL",
    presets: {
      staging: "https://live-staging.artsy.net",
      production: "https://live.artsy.net",
    },
  },
  webURL: {
    description: "Force URL",
    presets: {
      staging: "https://staging.artsy.net",
      production: "https://www.artsy.net",
    },
  },
})

export type EnvironmentKey = keyof typeof environmentOptions

export interface EnvironmentModel {
  activeEnvironment: Environment
  strings: Computed<this, { [k in EnvironmentKey]: string }>
  setEnvironment: Action<this, Environment>
}

export const getEnvironmentModel = (): EnvironmentModel => ({
  // TODO:
  // CRITICAL!
  // Detect if this is a test build or a production build
  // WE CAN NOT GO LIVE WITH THIS
  // See https://github.com/artsy/eigen/blob/2c4797a6f6395fd2a054570de0f70c37996e4533/src/lib/store/config/EnvironmentModel.tsx#L80
  // Reach out to #practice-mobile for more information
  activeEnvironment: __DEV__ ? "staging" : "production",
  strings: computed(({ activeEnvironment }) => {
    const result: { [k in EnvironmentKey]: string } = {} as any

    for (const [key, val] of Object.entries(environmentOptions)) {
      result[key as EnvironmentKey] = val.presets[activeEnvironment]
    }

    return result
  }),
  setEnvironment: action((state, environment) => {
    state.activeEnvironment = environment
  }),
})
