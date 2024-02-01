import { Button, Spacer, Join } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import * as Sentry from "@sentry/react-native"
import { ARTNativeModules } from "native_modules/ARTNativeModules"
import { NativeModules } from "react-native"
import { CodePushOptions } from "screens/Settings/DevMenu/CodePushOptions"
import { useSystemRelayEnvironment } from "system/relay/useSystemRelayEnvironment"
import { GlobalStore } from "system/store/GlobalStore"
import { attemptAlbumMigration } from "utils/attemptAlbumMigration"
import { useIsDarkMode } from "utils/hooks/useIsDarkMode"

export const DevMenu = () => {
  const currentEnvironment = GlobalStore.useAppState(
    (s) => s.config.environment.activeEnvironment
  )

  const isAnalyticsVisualizerEnabled = GlobalStore.useAppState(
    (state) => state.artsyPrefs.isAnalyticsVisualizerEnabled
  )

  const navigation = useNavigation()
  const { relayEnvironment } = useSystemRelayEnvironment()
  const isDarkMode = useIsDarkMode()

  return (
    <Join separator={<Spacer y={1} />}>
      <Button
        block
        variant={isDarkMode ? "fillLight" : "fillDark"}
        onPress={() =>
          GlobalStore.actions.artsyPrefs.toggleAnalyticsVisualizer()
        }
      >
        {isAnalyticsVisualizerEnabled ? "Hide" : "Show"} Analytics Visualizer
      </Button>

      <Button
        block
        variant={isDarkMode ? "fillLight" : "fillDark"}
        onPress={() => NativeModules.DevMenu.show()}
      >
        Show Native Dev Menu
      </Button>
      <Button
        block
        variant={isDarkMode ? "fillLight" : "fillDark"}
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

      <CodePushOptions />

      <Button
        block
        variant={isDarkMode ? "fillLight" : "fillDark"}
        onPress={() => ARTNativeModules.ARTAlbumMigrationModule.addTestAlbums()}
      >
        Add native test albums
      </Button>
      <Button
        block
        variant={isDarkMode ? "fillLight" : "fillDark"}
        onPress={() =>
          ARTNativeModules.ARTAlbumMigrationModule.resetAlbumReadAttempts()
        }
      >
        Reset Album Read Attempts
      </Button>
      <Button
        block
        variant={isDarkMode ? "fillLight" : "fillDark"}
        onPress={() => {
          attemptAlbumMigration(relayEnvironment)
        }}
      >
        Read albums
      </Button>
      <Button
        block
        variant={isDarkMode ? "fillLight" : "fillDark"}
        onPress={() => {
          Sentry.nativeCrash()
        }}
      >
        Trigger Sentry native crash
      </Button>
      <Button
        block
        variant={isDarkMode ? "fillLight" : "fillDark"}
        onPress={() => {
          throw Error("Sentry test error")
        }}
      >
        Trigger Sentry thrown error
      </Button>
    </Join>
  )
}
