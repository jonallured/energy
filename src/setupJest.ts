import "@testing-library/jest-native/extend-expect"
import "jest-extended"

import chalk from "chalk"
import expect from "expect"
import { format } from "util"

// MARK: - General preparation

const originalConsoleError = console.error
// TODO: Remove once we're no longer using JSDOM for enzyme static rendering.
console.error = (message?: any) => {
  if (
    typeof message === "string" &&
    (message.includes("is using uppercase HTML. Always use lowercase HTML tags in React.") ||
      /Warning: React does not recognize the `\w+` prop on a DOM element\./.test(message) ||
      /Warning: The tag <\w+> is unrecognized in this browser\./.test(message) ||
      /Warning: Unknown event handler property `\w+`\./.test(message) ||
      /Warning: An update to [\w\s]+ inside a test was not wrapped in act/.test(message) ||
      /Warning: Received `\w+` for a non-boolean attribute `\w+`\./.test(message) ||
      /Warning: [\w\s]+ has been extracted from react-native core/.test(message))
  ) {
    // NOOP
  } else {
    originalConsoleError(message)
  }
}

// @ts-expect-error
global.__TEST__ = true
declare const process: any

if (process.env.ALLOW_CONSOLE_LOGS !== "true") {
  const originalLoggers = {
    error: console.error,
    warn: console.warn,
  }

  function logToError(type: keyof typeof console, args: unknown[], constructorOpt: () => void) {
    const explanation =
      chalk.white(`Test failed due to \`console.${type}(…)\` call.\n`) +
      chalk.gray("(Disable with ALLOW_CONSOLE_LOGS=true env variable.)\n\n")
    if (args[0] instanceof Error) {
      const msg = explanation + chalk.red(args[0].message)
      const err = new Error(msg)
      err.stack = args[0].stack!.replace(`Error: ${args[0].message}`, msg)
      return err
    } else if (
      // Because we use react-dom in tests to render react-native components, a few warnings are being logged that we do
      // not care for, so ignore these.
      typeof args[0] === "string" &&
      !args[0].includes("is using incorrect casing") &&
      !args[0].includes("is unrecognized in this browser") &&
      ![args[0].includes("React does not recognize the `testID` prop on a DOM element.")]
    ) {
      const err = new Error(explanation + chalk.red(format(args[0], ...args.slice(1))))
      ;(Error as any).captureStackTrace(err, constructorOpt)
      return err
    }
    return null
  }

  beforeEach((done) => {
    const types: Array<"error" | "warn"> = ["error", "warn"]
    types.forEach((type) => {
      // Don't spy on loggers that have been modified by the current test.
      if (console[type] === originalLoggers[type]) {
        const handler = (...args: unknown[]) => {
          const error = logToError(type, args, handler)
          if (error) {
            done.fail(error)
          }
        }
        jest.spyOn(console, type).mockImplementation(handler)
      }
    })
    done() // it is important to call this here or every test will timeout
  })
}

// Waiting on https://github.com/thymikee/snapshot-diff/pull/17
import diff from "snapshot-diff"
expect.extend({ toMatchDiffSnapshot: (diff as any).toMatchDiffSnapshot })

// MARK: - External deps mocks

jest.mock("react-native-screens/native-stack", () => ({
  createNativeStackNavigator: require("@react-navigation/stack").createStackNavigator,
}))

import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock"
jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage)

// @ts-expect-error
import mockSafeAreaContext from "react-native-safe-area-context/jest/mock"
jest.mock("react-native-safe-area-context", () => mockSafeAreaContext)

// tslint:disable-next-line:no-var-requires
require("jest-fetch-mock").enableMocks()

export const mockNavigate = jest.fn()

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native")
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
      dispatch: jest.fn(),
    }),
  }
})

jest.mock("react-native-device-info", () => ({
  getBuildNumber: jest.fn(),
  getVersion: jest.fn(),
  getModel: () => "testDevice",
  getUserAgentSync: jest.fn(),
  getDeviceType: jest.fn(),
  hasNotch: jest.fn(),
}))

const _ = jest.requireActual("lodash")

jest.mock("react-native-reanimated", () => require("react-native-reanimated/mock"))

jest.mock("react-native/Libraries/LayoutAnimation/LayoutAnimation", () => ({
  ...jest.requireActual("react-native/Libraries/LayoutAnimation/LayoutAnimation"),
  configureNext: jest.fn((_config, callback) => callback?.()),
  create: jest.fn(),
  easeInEaseOut: jest.fn(),
  linear: jest.fn(),
  spring: jest.fn(),
}))

jest.mock("react-native-gesture-handler", () => {
  const View = require("react-native/Libraries/Components/View/View")
  const TouchableWithoutFeedback = require("react-native/Libraries/Components/Touchable/TouchableWithoutFeedback")
  const TouchableHighlight = require("react-native/Libraries/Components/Touchable/TouchableHighlight")
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    /* Buttons */
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    /* Other */
    FlatList: View,
    gestureHandlerRootHOC: jest.fn(),
    Directions: {},
    TouchableHighlight,
    TouchableWithoutFeedback,
  }
})
