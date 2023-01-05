import { LogBox } from "react-native"

const IGNORED_LOGS = [
  "lineHeight",
  "borderRadius",
  "fontSize",
  "onBackground",
  "borderWidth",
  "react-native-flipper",
]

const IGNORED_ERRORS = ["inside a test was not wrapped in act(...)"]

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
  const error = console.error

  console.warn = (...logs) => {
    const log = logs[0]
    const isIgnored = IGNORED_LOGS.some((ignoredLog) => log.includes(ignoredLog))

    if (!isIgnored) {
      warn(...logs)
    }
  }

  console.error = (...errors) => {
    const errorLog = errors[0]
    const isIgnored = IGNORED_ERRORS.some((ignoredError) => errorLog.includes(ignoredError))

    if (!isIgnored) {
      error(...errors)
    }
  }
}
