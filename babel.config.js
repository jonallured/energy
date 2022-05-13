const presets = [
  [
    "module:metro-react-native-babel-preset",
    {
      useTransformReactJSXExperimental: true, // this is so `import React from "react"` is not needed.
    },
  ],
  ["@babel/preset-react", { runtime: "automatic" }], // this is so `import React from "react"` is not needed.
]

const plugins = [
  // the relay plugin should run before other plugins or presets
  // to ensure the graphql template literals are correctly transformed
  "relay",
  [
    "module-resolver",
    {
      root: ["./"],
      alias: {
        "@Scenes": "./src/Scenes",
        "@store": "./src/store",
        "@relay": "./src/relay",
        "@routes": "./src/routes",
        "@helpers": "./src/helpers",
        "@assets": "./src/assets",
        "@tests": "./src/tests",
        "@utils": "./src/utils",
      },
    },
  ],
  "import-graphql", // to enabling import syntax for .graphql and .gql files.
  "react-native-reanimated/plugin", // This has to be listed last according to the documentation. https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation/#babel-plugin
]

if (process.env.CI) {
  // When running a bundled app, these statements can cause a big bottleneck in the JavaScript thread.
  // This includes calls from debugging libraries and logs we might forget to remove
  plugins.push("transform-remove-console")
}

module.exports = { presets, plugins }
