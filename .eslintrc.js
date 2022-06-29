/* eslint-disable no-unused-vars */
const OFF = "off"
const WARN = "warn"
const ERR = "error"
/* eslint-enable no-unused-vars */

module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:react/jsx-runtime",
    "plugin:import/typescript",
    "prettier", // "prettier" needs to be last!
  ],
  parser: "@typescript-eslint/parser",
  settings: {
    // This is needed to make eslint happy with name aliases
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
        // Choose from one of the "project" configs below or omit to use <root>/tsconfig.json by default
        // use <root>/path/to/folder/tsconfig.json
        project: "<root>/tsconfig.json",
      },
    },
  },
  rules: {
    // we want to enable some of these
    "import/no-named-as-default": OFF,
    "no-empty-pattern": OFF,
    "no-control-regex": OFF,
    "no-extra-boolean-cast": OFF,
    "no-redeclare": OFF,
    "no-undef": OFF,
    "no-unused-vars": OFF,
    "import/no-unresolved": OFF,
    "import/no-duplicates": OFF, // re-enable this
    "no-useless-catch": OFF,
    "no-useless-escape": OFF,
    "react/react-in-jsx-scope": OFF,
    "react-native/no-inline-styles": OFF,
  },
}
