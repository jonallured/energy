import { action, Action, State } from "easy-peasy"
import { assignDeep } from "app/utils/persistence"
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
}

export interface GlobalStoreModel extends GlobalStoreStateModel {
  reset: Action<this>

  // for testing only. noop otherwise.
  __inject: Action<this, DeepPartial<State<GlobalStoreStateModel>>>
}

export const getGlobalStoreModel = (): GlobalStoreModel => ({
  albums: getAlbumsModel(),
  artsyPrefs: getArtsyPrefsModel(),
  auth: getAuthModel(),
  config: getConfigModel(),
  devicePrefs: getDevicePrefsModel(),
  email: getEmailModel(),
  networkStatus: getNetworkStatusModel(),
  presentationMode: getPresentationModeModel(),
  selectMode: getSelectModeModel(),

  reset: action((state) => {
    state.auth.activePartnerID = null
  }),

  // For testing only. noop otherwise.
  __inject: __TEST__
    ? action((state, injectedState) => {
        assignDeep(state, injectedState)
      })
    : action(() => {
        console.error("Do not use this function outside of tests!!")
      }),
})

export type GlobalStoreState = State<GlobalStoreModel>
