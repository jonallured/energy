import AsyncStorage from "@react-native-async-storage/async-storage"
import { StoreProvider, createStore, createTypedHooks, persist } from "easy-peasy"
import { Platform } from "react-native"
import { DeepPartial } from "global"
import { GlobalStoreModel, GlobalStoreState } from "./Models/GlobalStoreModel"

const STORE_VERSION = 0

if (Platform.OS === "ios") {
  // @ts-ignore
  window.requestIdleCallback = null
}

const asyncStorage = {
  async getItem(key: string) {
    try {
      const res = await AsyncStorage.getItem(key)
      if (res) {
        return JSON.parse(res)
      }
    } catch (error) {
      throw error
    }
  },
  async setItem(key: string, data: string) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      throw error
    }
  },
  async removeItem(key: string) {
    try {
      await AsyncStorage.removeItem(key)
    } catch (error) {
      throw error
    }
  },
}

function createGlobalStore() {
  const store = createStore<GlobalStoreModel>(
    persist(GlobalStoreModel, {
      storage: asyncStorage,
    }),
    {
      name: "GlobalStore",
      version: STORE_VERSION,
      devTools: __DEV__,
    }
  )
  return store
}

const globalStoreInstance = createGlobalStore()

const hooks = createTypedHooks<GlobalStoreModel>()

export const GlobalStore = {
  useAppState: hooks.useStoreState,
  get actions() {
    return globalStoreInstance.getActions()
  },
}

export const GlobalStoreProvider: React.FC<{}> = ({ children }) => {
  return <StoreProvider store={globalStoreInstance}>{children}</StoreProvider>
}

/**
 * This is marked as unsafe because it will not cause a re-render
 */
export function unsafe__getEnvironment() {
  return { ...globalStoreInstance.getState().config.environment }
}

/**
 * This is marked as unsafe because it will not cause a re-render
 */
export function unsafe__getAuth() {
  return { ...globalStoreInstance.getState().auth }
}

// tslint:disable-next-line:variable-name
export const __globalStoreTestUtils__ = __TEST__
  ? {
      // this can be used to mock the initial state before mounting a test renderer
      // e.g. `__globalStoreTestUtils__?.injectState({ nativeState: { selectedTab: "sell" } })`
      // takes effect until the next test starts
      injectState: (state: DeepPartial<GlobalStoreState>) => {
        GlobalStore.actions.__inject(state)
      },
      getCurrentState: () => globalStoreInstance.getState(),
    }
  : undefined
