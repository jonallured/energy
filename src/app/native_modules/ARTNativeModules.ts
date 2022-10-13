import { NativeModules as AllNativeModules, Platform } from "react-native"

const noop: any = (name: string) => () =>
  console.warn(`method ${name} doesn't exist on android yet`)

interface ARTNativeModules {
  ARTAlbumMigrationModule: {
    readAlbums(): { name: string, artworkIDs: string[] }[] | null
    addTestAlbums(): void
  }
}

const NativeModulesIOS: ARTNativeModules = {
  ARTAlbumMigrationModule: AllNativeModules.ARTAlbumMigrationModule,
}

const NativeModulesAndroid: ARTNativeModules = {
  ARTAlbumMigrationModule: {
    readAlbums: noop("readAlbums"),
    addTestAlbums: noop("addTestAlbums")
  },
}

const nativeModules = () => {
  if (Platform.OS === "android") {
    return NativeModulesAndroid
  } else {
    return NativeModulesIOS
  }
}

export const ARTNativeModules: ARTNativeModules = nativeModules()