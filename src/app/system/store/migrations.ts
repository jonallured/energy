import { Store } from "easy-peasy"
import { GlobalStoreModel } from "app/system/store/Models/GlobalStoreModel"

/**
 * IMPORTANT
 * Before you modify this file please read
 * https://github.com/artsy/eigen/blob/main/docs/adding_state_migrations.md
 */

export const Versions = {
  AddActivePartnerId: 1,
  MigrateActivePartnerIdToAuthModel: 2,
}

export const CURRENT_APP_VERSION = Versions.MigrateActivePartnerIdToAuthModel

export type Migrations = Record<number, (oldState: any) => any>

export const energyAppMigrations: Migrations = {
  [Versions.AddActivePartnerId]: (state) => {
    state.activePartnerId = ""
  },
  [Versions.MigrateActivePartnerIdToAuthModel]: (state) => {
    state.auth.activePartnerId = ""
    delete state.activePartnerId
  },
}

export function performMigrations(store: Store<GlobalStoreModel>) {
  store.persist.resolveRehydration().then(() => {
    store.getActions().performMigrations()
  })
}
