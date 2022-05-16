const list = [
  "palette",
  "shared",
  "storybook",
  "__generated__",
  "Screens",
  "store",
  "routes",
  "relay",
  "utils",
  "helpers",
  "tests",
]

// babel module resolver just needs `*`
const babelModuleResolverAlias = list.reduce((acc, name) => {
  acc[name] = `./src/${name}`
  acc[`${name}/*`] = `./src/${name}/*`
  return acc
}, {})

// jest allows for regex
const jestModuleNameMap = list.reduce((acc, name) => {
  acc[`^${name}$`] = `<rootDir>/src/${name}`
  acc[`^${name}/(.*)`] = `<rootDir>/src/${name}/$1`
  return acc
}, {})

module.exports = {
  babelModuleResolverAlias,
  jestModuleNameMap,
}
