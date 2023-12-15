import * as Sentry from "@sentry/react-native"
import { Platform } from "react-native"
import Config from "react-native-config"
import { getBuildNumber, getVersion } from "react-native-device-info"
import { appJson } from "utils/jsonFiles"

// important! this must match the release version specified
// in fastfile in order for sourcemaps/sentry stacktraces to work
export const energySentryReleaseName = () => {
  const codePushReleaseName = appJson().codePushReleaseName
  if (codePushReleaseName && codePushReleaseName !== "none") {
    return codePushReleaseName
  } else {
    const prefix = Platform.OS === "ios" ? "ios" : "android"
    const buildNumber = getBuildNumber()
    const version = getVersion()
    return prefix + "-" + version + "-" + buildNumber
  }
}

const energySentryDist = () => {
  const codePushDist = appJson().codePushDist
  if (codePushDist && codePushDist !== "none") {
    return codePushDist
  } else {
    return getBuildNumber()
  }
}

export function setupSentry(props: Partial<Sentry.ReactNativeOptions> = {}) {
  // In DEV, enabling this will clober stack traces in errors and logs, obscuring
  // the source of the error. So we disable it in dev mode.
  if (__DEV__) {
    console.log("[dev] Sentry disabled in dev mode.")
    return
  }
  if (!Config.SENTRY_DSN) {
    console.error("Sentry DSN not set!!")
    return
  }

  Sentry.init({
    dsn: Config.SENTRY_DSN,
    release: energySentryReleaseName(),
    dist: energySentryDist(),
    enableAutoSessionTracking: true,
    autoSessionTracking: true,
    enableWatchdogTerminationTracking: false,
    ...props,
  })
}
