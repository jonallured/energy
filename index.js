import "react-native-reanimated"
import "react-native-gesture-handler"
import "react-native-get-random-values"

import { AppRegistry } from "react-native"
import { enableFreeze } from "react-native-screens"
import { name as appName } from "./app.json"
import { App } from "./src/App"

global.__TEST__ = false

// Prevent React component subtrees from rendering.
// This is still experimental so we can try it out and disable it later if it's unstable
enableFreeze(false)

AppRegistry.registerComponent(appName, () => App)
