import { action, Action, Computed, computed } from "easy-peasy"

export interface PresentationModeModel {
  isPresenationModeEnabled: boolean
  isHidePriceEnabled: boolean
  isHideWorksAvailabilityEnabled: boolean
  isHideConfidentialNotesEnabled: boolean
  isHideArtworkEditButtonEnabled: boolean

  hiddenItems: Computed<
    this,
    {
      price: boolean
      worksAvailability: boolean
      confidentialNotes: boolean
      editArtwork: boolean
    }
  >

  toggleIsPresenationModeEnabled: Action<this>
  toggleIsHidePriceEnabled: Action<this>
  toggleIsHideWorksAvailabilityEnabled: Action<this>
  toggleIsHideConfidentialNotesEnabled: Action<this>
  toggleIsHideArtworkEditButtonEnabled: Action<this>
}

export const PresentationModeModel: PresentationModeModel = {
  isPresenationModeEnabled: false,
  isHidePriceEnabled: true,
  isHideWorksAvailabilityEnabled: true,
  isHideConfidentialNotesEnabled: true,
  isHideArtworkEditButtonEnabled: true,

  hiddenItems: computed((state) => ({
    price: state.isPresenationModeEnabled && state.isHidePriceEnabled,
    worksAvailability: state.isPresenationModeEnabled && state.isHideWorksAvailabilityEnabled,
    confidentialNotes: state.isPresenationModeEnabled && state.isHideConfidentialNotesEnabled,
    editArtwork: state.isPresenationModeEnabled && state.isHideArtworkEditButtonEnabled,
  })),

  toggleIsPresenationModeEnabled: action((state) => {
    state.isPresenationModeEnabled = !state.isPresenationModeEnabled
  }),
  toggleIsHidePriceEnabled: action((state) => {
    state.isHidePriceEnabled = !state.isHidePriceEnabled
  }),
  toggleIsHideWorksAvailabilityEnabled: action((state) => {
    state.isHideWorksAvailabilityEnabled = !state.isHideWorksAvailabilityEnabled
  }),
  toggleIsHideConfidentialNotesEnabled: action((state) => {
    state.isHideConfidentialNotesEnabled = !state.isHideConfidentialNotesEnabled
  }),
  toggleIsHideArtworkEditButtonEnabled: action((state) => {
    state.isHideArtworkEditButtonEnabled = !state.isHideArtworkEditButtonEnabled
  }),
}
