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
}
