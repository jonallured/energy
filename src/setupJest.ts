// MARK: - General preparation

import "@testing-library/jest-native/extend-expect"

// MARK: - External deps mocks

import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock"
jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage)

// require("react-native-reanimated/lib/reanimated2/jestUtils").setUpTests()

jest.mock("react-native-config", () => {
  const mockConfig = {
    // 👇 examples until we actually have some for energy
    ARTSY_DEV_API_CLIENT_SECRET: "artsy_api_client_secret", // pragma: allowlist secret
    SEGMENT_PRODUCTION_WRITE_KEY_IOS: "segment_production_write_key_ios", // pragma: allowlist secret
  }
  // support both default and named export
  return { ...mockConfig, Config: mockConfig }
})

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}))

jest.mock("expo-mail-composer", () => ({ composeAsync: jest.fn() }))

jest.mock("@gorhom/bottom-sheet", () => {
  const react = require("react-native")
  return {
    __esModule: true,
    default: react.View,
    BottomSheetScrollView: react.ScrollView,
  }
})

jest.mock("shared/hooks", () => {
  const screenDimensions: ScreenDimensionsWithSafeAreas = {
    width: 380,
    height: 550,
    orientation: "portrait",
    size: "small",
    isSmallScreen: true,
    safeAreaInsets: {
      top: 20,
      left: 0,
      right: 0,
      bottom: 0,
    },
  }
  return {
    ...jest.requireActual("shared/hooks"),
    useScreenDimensions: () => screenDimensions,
  }
})

jest.mock("rn-fetch-blob", () => ({
  config: () => ({
    fetch: jest.fn(),
  }),
  fs: {
    exists: jest.fn(),
    dirs: {
      DocumentDir: "path/to/documents",
    },
  },
}))

jest.mock("react-native-file-viewer", () => ({
  open: jest.fn(),
}))

jest.mock("@react-native-cookies/cookies", () => ({ clearAll: jest.fn() }))

beforeEach(() => {
  require("@react-native-cookies/cookies").clearAll.mockReset()
})

// @ts-expect-error
import mockSafeAreaContext from "react-native-safe-area-context/jest/mock"
jest.mock("react-native-safe-area-context", () => mockSafeAreaContext)

jest.mock("react-native-device-info", () => ({
  getBuildNumber: jest.fn(),
  getVersion: jest.fn(),
  getModel: () => "testDevice",
  getUserAgentSync: jest.fn(),
  getDeviceType: jest.fn(),
  hasNotch: jest.fn(),
  isTablet: jest.fn(),
}))

jest.mock("react-native-haptic-feedback", () => ({}))

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
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: View,
    gestureHandlerRootHOC: jest.fn(),
    Directions: {},
    TouchableHighlight,
    TouchableWithoutFeedback,
  }
})

// MARK: - Internal stuff mocks

jest.mock("app/relay/environment/createEnvironment", () => ({
  createEnvironment: require("relay-test-utils").createMockEnvironment,
}))

import { resetEnvironment } from "app/relay/environment/resetEnvironment"
import { ScreenDimensionsWithSafeAreas } from "shared/hooks"
beforeEach(() => {
  resetEnvironment()
})
