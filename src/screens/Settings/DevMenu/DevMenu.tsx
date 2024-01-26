import { Button, Spacer, Join } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import * as Sentry from "@sentry/react-native"
import { ARTNativeModules } from "native_modules/ARTNativeModules"
import { NativeModules } from "react-native"
import { CodePushOptions } from "screens/Settings/DevMenu/CodePushOptions"
import { useSystemRelayEnvironment } from "system/relay/useSystemRelayEnvironment"
import { GlobalStore } from "system/store/GlobalStore"
import { SelectedItemArtwork } from "system/store/Models/SelectModeModel"
import { attemptAlbumMigration } from "utils/attemptAlbumMigration"

export const DevMenu = () => {
  const navigation = useNavigation()
  const currentEnvironment = GlobalStore.useAppState((s) => s.config.environment.activeEnvironment)
  const { relayEnvironment } = useSystemRelayEnvironment()

  return (
    <Join separator={<Spacer y={1} />}>
      <CodePushOptions />

      <Button block onPress={() => NativeModules.DevMenu.show()}>
        Show Native Dev Menu
      </Button>
      <Button
        block
        onPress={() => {
          GlobalStore.actions.config.environment.setEnvironment(
            currentEnvironment === "staging" ? "production" : "staging"
          )
          GlobalStore.actions.auth.signOut()
          navigation.goBack()
        }}
      >
        Switch to {currentEnvironment == "staging" ? "production" : "staging"}
      </Button>
      {/* eslint-disable-next-line */}

      <Button block onPress={() => ARTNativeModules.ARTAlbumMigrationModule.addTestAlbums()}>
        Add native test albums
      </Button>
      <Button
        block
        onPress={() => ARTNativeModules.ARTAlbumMigrationModule.resetAlbumReadAttempts()}
      >
        Reset Album Read Attempts
      </Button>
      <Button
        block
        onPress={() => {
          attemptAlbumMigration(relayEnvironment)
        }}
      >
        Read albums
      </Button>
      <Button
        block
        onPress={() => {
          Sentry.nativeCrash()
        }}
      >
        Trigger Sentry native crash
      </Button>
      <Button
        block
        onPress={() => {
          throw Error("Sentry test error")
        }}
      >
        Trigger Sentry thrown error
      </Button>
    </Join>
  )
}
