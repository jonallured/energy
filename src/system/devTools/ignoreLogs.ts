import { LogBox } from "react-native"

const IGNORED_LOGS = [
  "borderRadius",
  "borderWidth",
  "fontSize",
  "lineHeight",
  "onBackground",
  "react-native-flipper",
]

/**
 * Ignore runtime application logs
 */
export const ignoreLogs = () => {
  LogBox.ignoreLogs(IGNORED_LOGS)
}
