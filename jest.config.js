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
  transformIgnorePatterns: [
    "node_modules/(?!(@react-native|react-native|react-native-reanimated|@babel|react-native-safe-area-context|react-native-linear-gradient)/)",
  ],
  watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],
}
