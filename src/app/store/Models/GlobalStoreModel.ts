import { action, Action, State } from "easy-peasy"
import { DeepPartial } from "global"
import { AlbumsModel, getAlbumsModel } from "./AlbumsModel"
import { ArtsyPrefsModel, getArtsyPrefsModel } from "./ArtsyPrefsModel"
import { AuthModel, getAuthModel } from "./AuthModel"
import { ConfigModel, getConfigModel } from "./ConfigModel"
import { DevicePrefsModel, getDevicePrefsModel } from "./DevicePrefsModel"
import { EmailModel, getEmailModel } from "./EmailModel"
import { getPresentationModeModel, PresentationModeModel } from "./PresenationModeModel"
import { SelectModeModel, getSelectModeModel } from "./SelectModeModel"
import { assignDeep } from "../../../shared/utils/persistence"

type ActiveMode = "viewer" | "manager"
interface GlobalStoreStateModel {
  activeMode: ActiveMode
  activePartnerID: string | null
  albums: AlbumsModel
  artsyPrefs: ArtsyPrefsModel
  auth: AuthModel
  config: ConfigModel
  devicePrefs: DevicePrefsModel
  email: EmailModel
  presentationMode: PresentationModeModel
  selectMode: SelectModeModel
}

export interface GlobalStoreModel extends GlobalStoreStateModel {
  setActivePartnerID: Action<this, string | null>
  setActiveMode: Action<this, ActiveMode>

  reset: Action<this>

  // for testing only. noop otherwise.
  __inject: Action<this, DeepPartial<State<GlobalStoreStateModel>>>
}

export const getGlobalStoreModel = (): GlobalStoreModel => ({
  activeMode: "viewer",
  activePartnerID: null,
  albums: getAlbumsModel(),
  artsyPrefs: getArtsyPrefsModel(),
  auth: getAuthModel(),
  config: getConfigModel(),
  devicePrefs: getDevicePrefsModel(),
  email: getEmailModel(),
  presentationMode: getPresentationModeModel(),
  reset: action((state) => {
    state.activePartnerID = null
    state.activeMode = "viewer"
  }),
  selectMode: getSelectModeModel(),
  setActivePartnerID: action((state, partnerID) => {
    state.activePartnerID = partnerID
  }),
  setActiveMode: action((state, mode) => {
    state.activeMode = mode
  }),

  // for testing only. noop otherwise.
  __inject: __TEST__
    ? action((state, injectedState) => {
        assignDeep(state, injectedState)
      })
    : action(() => {
        console.error("Do not use this function outside of tests!!")
      }),
})

export type GlobalStoreState = State<GlobalStoreModel>
