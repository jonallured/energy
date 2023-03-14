import { action, Action, State } from "easy-peasy"
import { getSystemModel, SystemModel } from "system/store/Models/SystemModel"
import { CURRENT_APP_VERSION } from "system/store/migrations"
import { migrateState } from "system/store/persistence/migrateState"
import { assignDeep } from "system/store/persistence/sanitize"
import { AlbumsModel, getAlbumsModel } from "./AlbumsModel"
import { ArtsyPrefsModel, getArtsyPrefsModel } from "./ArtsyPrefsModel"
import { AuthModel, getAuthModel } from "./AuthModel"
import { ConfigModel, getConfigModel } from "./ConfigModel"
import { DevicePrefsModel, getDevicePrefsModel } from "./DevicePrefsModel"
import { EmailModel, getEmailModel } from "./EmailModel"
import { getNetworkStatusModel, NetworkStatusModel } from "./NetworkStatusModel"
import { getPresentationModeModel, PresentationModeModel } from "./PresentationModeModel"
import { SelectModeModel, getSelectModeModel } from "./SelectModeModel"

interface GlobalStoreStateModel {
  albums: AlbumsModel
  artsyPrefs: ArtsyPrefsModel
  auth: AuthModel
  config: ConfigModel
  devicePrefs: DevicePrefsModel
  email: EmailModel
  networkStatus: NetworkStatusModel
  presentationMode: PresentationModeModel
  selectMode: SelectModeModel
  system: SystemModel

  // Meta state / actions
  version: number

  // Operates on the system model, but must remain here in order to gain access
  // to all state.
  performMigrations: Action<this>
}

export interface GlobalStoreModel extends GlobalStoreStateModel {
  reset: Action<this>

  // for testing only. noop otherwise.
  __inject: Action<this, DeepPartial<State<GlobalStoreStateModel>>>
}

export const getGlobalStoreModel = (): GlobalStoreModel => ({
  version: CURRENT_APP_VERSION,

  albums: getAlbumsModel(),
  artsyPrefs: getArtsyPrefsModel(),
  auth: getAuthModel(),
  config: getConfigModel(),
  devicePrefs: getDevicePrefsModel(),
  email: getEmailModel(),
  networkStatus: getNetworkStatusModel(),
  presentationMode: getPresentationModeModel(),
  selectMode: getSelectModeModel(),
  system: getSystemModel(),

  reset: action((state) => {
    state.auth.activePartnerID = null
  }),

  // Migrates the locally persisted state to the latest version
  performMigrations: action((state) => {
    migrateState({ state })

    state.system.sessionState.isDonePerformingMigrations = true
  }),

  // For testing only. noop otherwise.
  __inject: __TEST__
    ? action((state, injectedState) => {
        assignDeep(state, injectedState)
      })
    : action(() => {
        console.error("[store]: Do not use this function outside of tests!!")
      }),
})

export type GlobalStoreState = State<GlobalStoreModel>
