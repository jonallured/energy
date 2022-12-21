declare module "" {
  global {
    const __TEST__: boolean
    const __STORYBOOK__: boolean
  }
}

declare module "@react-native-seoul/masonry-list" {
  // FIXME: What are the proper typings for this
  const MasonryList: React.FC<any>
}
