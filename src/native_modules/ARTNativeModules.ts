import { NativeModules, Platform } from "react-native"

const noop: any = (name: string) => () =>
  console.warn(`method ${name} doesn't exist on android yet`)

interface ARTNativeModules {
  ARTAlbumMigrationModule: {
    readAlbums(): { name: string; artworkIDs: string[] }[] | null
    addTestAlbums(): void
    resetAlbumReadAttempts(): void
  }
}

const NativeModulesIOS: ARTNativeModules = {
  ARTAlbumMigrationModule: NativeModules.ARTAlbumMigrationModule,
}

const NativeModulesAndroid: ARTNativeModules = {
  ARTAlbumMigrationModule: {
    readAlbums: noop("readAlbums"),
    addTestAlbums: noop("addTestAlbums"),
    resetAlbumReadAttempts: noop("resetAlbumReadAttempts"),
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
