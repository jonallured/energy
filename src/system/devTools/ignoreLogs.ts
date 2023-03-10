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
