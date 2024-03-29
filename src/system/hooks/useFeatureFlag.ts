import { useFlag } from "@unleash/proxy-client-react"

const FEATURE_FLAGS_LIST = ["amber_folio-partner-convos"] as const

/**
 * Feature flags are defined within Unleash
 */
type FeatureFlag = (typeof FEATURE_FLAGS_LIST)[number]

export const useFeatureFlag = (flagName: FeatureFlag) => {
  const featureFlag = useFlag(flagName)
  return featureFlag
}
