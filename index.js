/**
 * @format
 */

import { AppRegistry } from "react-native"
import { App } from "./src/App"
import { name as appName } from "./app.json"
import "react-native-gesture-handler"
import { enableFreeze } from "react-native-screens"

global.__TEST__ = false

// Prevent React component subtrees from rendering.
// This is still experimental so we can try it out and disable it later if it's unstable
enableFreeze(false)

AppRegistry.registerComponent(appName, () => App)
