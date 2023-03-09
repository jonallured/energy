import { LogBox } from "react-native"

const IGNORED_LOGS = [
  "lineHeight",
  "borderRadius",
  "fontSize",
  "onBackground",
  "borderWidth",
  "react-native-flipper",
]

/**
 * Ignore runtime application logs
 */
export const ignoreLogs = () => {
  LogBox.ignoreLogs(IGNORED_LOGS)
}

/**
 * Ignore logs in tests
 */
export const ignoreLogsInTests = () => {
  const warn = console.warn

  console.warn = (...logs) => {
    const log = logs[0]
    const isIgnored = IGNORED_LOGS.some((ignoredLog) => log?.includes(ignoredLog))

    if (!isIgnored) {
      warn(...logs)
    }
  }
}
