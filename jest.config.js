module.exports = {
  globals: { __TEST__: true },
  moduleFileExtensions: ["ts", "tsx", "js"],
  preset: "react-native",
  setupFilesAfterEnv: ["jest-extended/all", "./src/setupJest.ts"],
  testMatch: ["<rootDir>/src/**/*.tests.(ts|tsx|js)"],
  testEnvironment: "jsdom",
  transform: {
    ".*[jt]sx?$": "babel-jest",
    "\\.graphql$": "jest-raw-loader",
  },

  // docs on this: https://jestjs.io/docs/tutorial-react-native#transformignorepatterns-customization
  transformIgnorePatterns: [
    // the following are libs that *will* be transformed
    "node_modules/(?!(" +
      "|@artsy/palette-mobile" + // no `|` on the first one
      "|@babel" +
      "|@react-native" +
      "|@react-native-seoul/masonry-list" +
      "|expo-mail-composer" +
      "|expo-modules-core" +
      "|moti" +
      "|react-native-file-viewer" +
      "|react-native-linear-gradient" +
      "|react-native-qrcode-generator" +
      "|react-native-reanimated" +
      "|react-native-safe-area-context" +
      "|react-native-webview" +
      "|react-native" +
      ")/)",
  ],
}
