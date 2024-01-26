import "react-native-gesture-handler"
import "react-native-get-random-values"

import { AppRegistry } from "react-native"
import { name as appName } from "./app.json"
import { App } from "./src/App"

global.__TEST__ = false

AppRegistry.registerComponent(appName, () => App)
