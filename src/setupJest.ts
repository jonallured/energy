import "@testing-library/jest-native/extend-expect"
import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock"
import mockRNCNetInfo from "@react-native-community/netinfo/jest/netinfo-mock.js"
import React from "react"

// @ts-expect-error
import mockSafeAreaContext from "react-native-safe-area-context/jest/mock"
import { ScreenDimensionsWithSafeAreas } from "utils/hooks/useScreenDimensions"

// Patch setImmediate for Jest 27
// @ts-ignore
global.setImmediate = (fn) => global.setTimeout(fn, 0)
global.clearImmediate = jest.fn()

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage)

jest.mock("react-native-reanimated", () => require("react-native-reanimated/mock"))

jest.mock("@react-native-community/netinfo", () => mockRNCNetInfo)

jest.mock("react-native-collapsible-tab-view", () => {
  const React = require("react-native")
  return {
    useCurrentTabScrollY: jest.fn(),
    Tabs: {
      ScrollView: React.ScrollView,
      FlatList: React.FlatList,
    },
  }
})

jest.mock("react-native-config", () => {
  const mockConfig = {
    // 👇 examples until we actually have some for energy
    ARTSY_DEV_API_CLIENT_SECRET: "artsy_api_client_secret", // pragma: allowlist secret
    SEGMENT_PRODUCTION_WRITE_KEY_IOS: "segment_production_write_key_ios", // pragma: allowlist secret
  }
  // support both default and named export
  return { ...mockConfig, Config: mockConfig }
})

jest.mock("react-native-fs", () => ({
  mkdir: jest.fn(),
  moveFile: jest.fn(),
  copyFile: jest.fn(),
  pathForBundle: jest.fn(),
  pathForGroup: jest.fn(),
  getFSInfo: jest.fn(),
  getAllExternalFilesDirs: jest.fn(),
  unlink: jest.fn(),
  exists: jest.fn(),
  stopDownload: jest.fn(),
  resumeDownload: jest.fn(),
  isResumable: jest.fn(),
  stopUpload: jest.fn(),
  completeHandlerIOS: jest.fn(),
  readDir: jest.fn(),
  readDirAssets: jest.fn(),
  existsAssets: jest.fn(),
  readdir: jest.fn(),
  setReadable: jest.fn(),
  stat: jest.fn(),
  readFile: jest.fn(),
  read: jest.fn(),
  readFileAssets: jest.fn(),
  hash: jest.fn(),
  copyFileAssets: jest.fn(),
  copyFileAssetsIOS: jest.fn(),
  copyAssetsVideoIOS: jest.fn(),
  writeFile: jest.fn(),
  appendFile: jest.fn(),
  write: jest.fn(),
  downloadFile: jest.fn(),
  uploadFiles: jest.fn(),
  touch: jest.fn(),
  MainBundlePath: jest.fn(),
  CachesDirectoryPath: jest.fn(),
  DocumentDirectoryPath: jest.fn(),
  ExternalDirectoryPath: jest.fn(),
  ExternalStorageDirectoryPath: jest.fn(),
  TemporaryDirectoryPath: jest.fn(),
  LibraryDirectoryPath: jest.fn(),
  PicturesDirectoryPath: jest.fn(),
}))

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}))

jest.mock("@gorhom/bottom-sheet", () => {
  const react = require("react-native")
  return {
    __esModule: true,
    default: react.View,
    BottomSheetScrollView: react.ScrollView,
    BottomSheetModalProvider: react.View,
    BottomSheetModalView: react.View,
  }
})

jest.mock("utils/hooks/useScreenDimensions", () => {
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
    ...jest.requireActual("utils/hooks/useScreenDimensions"),
    ProvideScreenDimensions: ({ children }: { children: React.ReactNode }) => children,
    useScreenDimensions: () => screenDimensions,
  }
})

// tslint:disable-next-line:no-var-requires
require("jest-fetch-mock").enableMocks()

jest.mock("react-native-file-viewer", () => ({
  open: jest.fn(),
}))

jest.mock("@react-native-cookies/cookies", () => ({ clearAll: jest.fn() }))

beforeEach(() => {
  require("@react-native-cookies/cookies").clearAll.mockReset()
})

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

jest.mock("system/wrappers/RetryErrorBoundary", () => ({
  GlobalRetryErrorBoundary: ({ children }: any) => children,
}))

jest.mock("system/wrappers/CachedImage", () => ({
  CachedImage: jest.requireActual("react-native").Image,
}))

jest.mock("system/hooks/useSystemIsDoneBooting", () => ({
  useSystemIsDoneBooting: () => true,
}))

// TODO: remove this and mock open a followup to fix this. We SHOULDN'T mock ALL the packages that go into energy
jest.mock("react-native-popover-view", () => ({}))

jest.mock("@artsy/palette-mobile", () => {
  const React = require("react-native")
  const palette = jest.requireActual("@artsy/palette-mobile")

  return {
    ...palette,
    Tabs: {
      ...palette.Tabs,
      ScrollView: React.ScrollView,
      FlatList: React.FlatList,
    },
  }
})

jest.mock("components/Toast/ToastContext", () => ({
  ToastProvider: ({ children }: any) => children,
  useToast: () => ({
    toast: {
      show: jest.fn(),
      hide: jest.fn(),
    },
  }),
}))

jest.mock("react-native-mail", () => ({
  mail: jest.fn(),
}))

jest.mock("react-native-html-to-pdf", () => {
  return {
    convert: jest.fn(),
  }
})
