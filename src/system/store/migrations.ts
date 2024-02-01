/**
 * IMPORTANT
 * Before you modify this file please read
 * https://github.com/artsy/eigen/blob/main/docs/adding_state_migrations.md
 */

export const Versions = {
  AddActivePartnerId: 1,
  MigrateActivePartnerIdToAuthModel: 2,
  MigrateRefactoredSelectModeStore: 3,
  MigrateEmailModelCCName: 4,
  MigrateToUpstreamPesistedStateMigrations: 5,
}

export const CURRENT_APP_VERSION =
  Versions.MigrateToUpstreamPesistedStateMigrations

export type Migrations = Record<number, (oldState: any) => any>

export const energyAppMigrations: Migrations = {
  [Versions.AddActivePartnerId]: (state) => {
    state.activePartnerId = ""
  },
  [Versions.MigrateActivePartnerIdToAuthModel]: (state) => {
    state.auth.activePartnerId = ""
    delete state.activePartnerId
  },
  [Versions.MigrateEmailModelCCName]: (state) => {
    state.email.ccRecipients = state.email.emailsCC
    delete state.email.emailsCC
  },
  [Versions.MigrateToUpstreamPesistedStateMigrations]: (state) => {
    state._migrationVersion = CURRENT_APP_VERSION
  },
}
