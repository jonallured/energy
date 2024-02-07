import AsyncStorage from "@react-native-async-storage/async-storage"
import { FlagProvider } from "@unleash/proxy-client-react"
import Config from "react-native-config"
import { GlobalStore } from "system/store/GlobalStore"

export const FeatureFlagProvider: React.FC = ({ children }) => {
  const storageName = (name: string) => `unleash:${name}`

  const isProduction = GlobalStore.useAppState(
    (state) => state.config.environment.activeEnvironment === "production"
  )
  const userId = GlobalStore.useAppState(
    (state) => state.auth.userID ?? undefined
  )

  return (
    <FlagProvider
      config={{
        appName: "folio",
        url: (isProduction
          ? Config.UNLEASH_PROXY_URL_PRODUCTION
          : Config.UNLEASH_PROXY_URL_STAGING) as string,
        clientKey: (isProduction
          ? Config.UNLEASH_PROXY_CLIENT_KEY_PRODUCTION
          : Config.UNLEASH_PROXY_CLIENT_KEY_STAGING) as string,
        context: {
          userId,
        },
        // Don't refresh. we will manually refresh when the app goes in the background.
        // See: src/Navigation.tsx
        refreshInterval: 0,
        storageProvider: {
          save: async (name, data) => {
            AsyncStorage.setItem(storageName(name), JSON.stringify(data))
          },
          get: async (name) => {
            const data = await AsyncStorage.getItem(storageName(name))
            return data ? JSON.parse(data) : undefined
          },
        },
      }}
    >
      {children}
    </FlagProvider>
  )
}
