import { current, produce, setAutoFreeze } from "immer"
import { CURRENT_APP_VERSION, energyAppMigrations, Migrations } from "system/store/migrations"

const enableLogging = __DEV__ && !__TEST__

export function migrateState<State extends { version: number }>({
  state,
  migrations = energyAppMigrations,
  toVersion = CURRENT_APP_VERSION,
}: {
  state: State
  migrations?: Migrations
  toVersion?: number
}): {
  version: number
} {
  if (typeof state.version !== "number") {
    throw new Error("[migrateState]: Bad state.version " + JSON.stringify(state))
  }

  while (state.version < toVersion) {
    const nextVersion = state.version + 1
    const migrator = migrations[nextVersion]

    if (!migrator) {
      throw new Error("[migrateState]: No migrator found for app version " + nextVersion)
    }

    if (enableLogging) {
      console.log(
        `[migrateState]: Migrating from version ${state.version} to ${nextVersion}. Old state:`,
        current(state)
      )
    }

    // If testing, use immer directly since we're not concerned with automatic
    // persistence, but rather correctness of the migration. Outside of tests
    // `state` is already an immer draft object.
    if (__TEST__) {
      setAutoFreeze(false)
      state = produce(state, migrator)
      state.version = nextVersion
      setAutoFreeze(true)
    } else {
      migrator(state)
      state.version = nextVersion
    }
  }

  if (enableLogging) {
    console.log(`[migrateState]: Complete.`, current(state))
  }

  return state
}
