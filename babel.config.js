const presets = [
  [
    "module:metro-react-native-babel-preset",
    { useTransformReactJSXExperimental: true }, // this is so `import React from "react"` is not needed.
  ],
  "@babel/preset-typescript",
  ["@babel/preset-react", { runtime: "automatic" }], // this is so `import React from "react"` is not needed.
]

const plugins = [
  // The relay plugin should run before other plugins or presets
  // to ensure the graphql template literals are correctly transformed
  "relay",
  "import-graphql", // to enabling import syntax for .graphql and .gql files.
  "react-native-reanimated/plugin", // This has to be listed last according to the documentation. https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation/#babel-plugin
  [
    "module-resolver",
    {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      root: ["./src"],
    },
  ],
]

if (process.env.CI) {
  // When running a bundled app, these statements can cause a big bottleneck in the JavaScript thread.
  // This includes calls from debugging libraries and logs we might forget to remove
  plugins.push("transform-remove-console")
}

module.exports = { presets, plugins }
