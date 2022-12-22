const moduleNameMap = require("./alias").jestModuleNameMap

module.exports = {
  preset: "react-native",
  moduleFileExtensions: ["ts", "tsx", "js"],
  testMatch: ["<rootDir>/**/*.tests.(ts|tsx|js)"],
  testEnvironment: "jsdom",
  globals: { __TEST__: true },
  moduleNameMapper: moduleNameMap,
  transform: {
    ".*[jt]sx?$": "babel-jest",
    "\\.graphql$": "jest-raw-loader",
  },
  setupFilesAfterEnv: ["jest-extended/all", "./src/setupJest.ts"],

  // docs on this: https://jestjs.io/docs/tutorial-react-native#transformignorepatterns-customization
  transformIgnorePatterns: [
    // the following are libs that *will* be transformed
    "node_modules/(?!(" +
      "@react-native" + // no `|` on the first one
      "|react-native" +
      "|react-native-reanimated" +
      "|expo-modules-core" +
      "|expo-mail-composer" +
      "|@babel" +
      "|@artsy/palette-mobile" +
      "|react-native-safe-area-context" +
      "|react-native-linear-gradient" +
      "|@react-native-seoul/masonry-list" +
      "|react-native-file-viewer" +
      "|react-native-qrcode-generator" +
      "|react-native-webview" +
      ")/)",
  ],
  watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],
}
