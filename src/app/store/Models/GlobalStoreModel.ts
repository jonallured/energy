import { action, Action, State } from "easy-peasy"
import { DeepPartial } from "global"
import { AlbumsModel } from "./AlbumsModel"
import { AuthModel } from "./AuthModel"
import { ConfigModel } from "./ConfigModel"
import { DevicePrefsModel, getDevicePrefsModel } from "./DevicePrefsModel"
import { PresentationModeModel } from "./PresenationModeModel"
import { SelectModeModel, getSelectModeModel } from "./SelectModeModel"
import { assignDeep } from "../../../shared/utils/persistence"

type ActiveMode = "viewer" | "manager"
interface GlobalStoreStateModel {
  auth: AuthModel
  config: ConfigModel
  albums: AlbumsModel
  devicePrefs: DevicePrefsModel
  presentationMode: PresentationModeModel
  selectMode: SelectModeModel
  activePartnerID: string | null
  activeMode: ActiveMode
}

export interface GlobalStoreModel extends GlobalStoreStateModel {
  setActivePartnerID: Action<this, string | null>
  setActiveMode: Action<this, ActiveMode>

  reset: Action<this>

  // for testing only. noop otherwise.
  __inject: Action<this, DeepPartial<State<GlobalStoreStateModel>>>
}

export const GlobalStoreModel: GlobalStoreModel = {
  auth: AuthModel,
  config: ConfigModel,
  albums: AlbumsModel,
  devicePrefs: getDevicePrefsModel(),
  presentationMode: PresentationModeModel,
  selectMode: getSelectModeModel(),
  activePartnerID: null,
  activeMode: "viewer",

  setActivePartnerID: action((state, partnerID) => {
    state.activePartnerID = partnerID
  }),
  setActiveMode: action((state, mode) => {
    state.activeMode = mode
  }),

  reset: action((state) => {
    state.activePartnerID = null
    state.activeMode = "viewer"
  }),

  // for testing only. noop otherwise.
  __inject: __TEST__
    ? action((state, injectedState) => {
        assignDeep(state, injectedState)
      })
    : action(() => {
        console.error("Do not use this function outside of tests!!")
      }),
}

export type GlobalStoreState = State<GlobalStoreModel>
