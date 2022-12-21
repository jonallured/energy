let metaflags = {
  showLoggerMiddleware: false,
  showPerfMiddleware: false,
}

if (__DEV__ || __TEST__) {
  try {
    const fileContents = require("../../../metaflags.json")
    metaflags = { ...metaflags, ...fileContents }
    // eslint-disable-next-line no-empty
  } catch {}
}

export const showLoggerMiddleware = metaflags.showLoggerMiddleware
export const showPerfMiddleware = metaflags.showPerfMiddleware
