import {
  StoreProvider,
  createStore,
  createTypedHooks,
  persist,
} from "easy-peasy"
import { Platform } from "react-native"
import { Action, Middleware } from "redux"
import {
  CURRENT_APP_VERSION,
  energyAppMigrations,
} from "system/store/migrations"
import { sanitize } from "system/store/persistence/sanitize"
import { storageAdapter } from "system/store/persistence/storageAdapter"
import {
  GlobalStoreModel,
  getGlobalStoreModel,
  GlobalStoreState,
} from "./Models/GlobalStoreModel"

const STORE_VERSION = 1

if (Platform.OS === "ios") {
  // @ts-ignore
  window.requestIdleCallback = null
}

function createGlobalStore() {
  const middleware: Middleware[] = []

  if (__TEST__ && __globalStoreTestUtils__) {
    __globalStoreTestUtils__.dispatchedActions = []
    middleware.push((_api) => (next) => (_action) => {
      __globalStoreTestUtils__.dispatchedActions.push(_action)
      next(_action)
    })
  }

  const store = createStore<GlobalStoreModel>(
    persist(getGlobalStoreModel(), {
      storage: storageAdapter,
      transformers: [
        { in: (data) => sanitize(data), out: (data) => sanitize(data) },
      ],
      migrations: {
        migrationVersion: CURRENT_APP_VERSION,
        ...energyAppMigrations,
      },
    }),
    {
      name: "GlobalStore",
      version: STORE_VERSION,
      devTools: __DEV__,
      middleware,
    }
  )

  return store
}

// TODO: If this variable is moved within the file (say, to the bottom, where it
// is out of the way) tests start to fail. Fix this order of operations issue.
export const __globalStoreTestUtils__ = __TEST__
  ? {
      // This can be used to mock the initial state before mounting a test renderer
      // e.g. `__globalStoreTestUtils__?.injectState({ nativeState: { selectedTab: "sell" } })`
      // takes effect until the next test starts
      injectState: (state: DeepPartial<GlobalStoreState>) => {
        GlobalStore.actions.__inject(state)
      },
      getCurrentState: () => globalStoreInstance().getState(),
      dispatchedActions: [] as Action[],
      reset: () => {
        _globalStoreInstance = undefined
      },
    }
  : undefined

let _globalStoreInstance: ReturnType<typeof createGlobalStore> | undefined
const globalStoreInstance = (): ReturnType<typeof createGlobalStore> => {
  if (_globalStoreInstance === undefined) {
    _globalStoreInstance = createGlobalStore()
  }
  return _globalStoreInstance
}

const hooks = createTypedHooks<GlobalStoreModel>()

export const GlobalStore = {
  useAppState: hooks.useStoreState,
  getState: globalStoreInstance().getState,
  get actions() {
    return globalStoreInstance().getActions()
  },
}

export const GlobalStoreProvider: React.FC<{}> = ({ children }) => {
  return <StoreProvider store={globalStoreInstance()}>{children}</StoreProvider>
}

/**
 * This is marked as unsafe because it will not cause a re-render
 */
export function unsafe__getEnvironment() {
  return { ...globalStoreInstance().getState().config.environment }
}

/**
 * This is marked as unsafe because it will not cause a re-render
 */
export function unsafe__getAuth() {
  return { ...globalStoreInstance().getState().auth }
}
