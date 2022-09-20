import { action, Action, Computed, computed } from "easy-peasy"

export interface PresentationModeModel {
  isPresenationModeEnabled: boolean
  isHidePriceEnabled: boolean
  isHidePriceForSoldWorksEnabled: boolean
  isHideUnpublishedWorksEnabled: boolean
  isHideWorksNotForSaleEnabled: boolean
  isHideWorksAvailabilityEnabled: boolean
  isHideConfidentialNotesEnabled: boolean
  isHideArtworkEditButtonEnabled: boolean

  hiddenItems: Computed<
    this,
    {
      price: boolean
      priceForSoldWorks: boolean
      unpublishedWorks: boolean
      worksNotForSale: boolean
      worksAvailability: boolean
      confidentialNotes: boolean
      editArtwork: boolean
    }
  >

  toggleIsPresenationModeEnabled: Action<this>
  toggleIsHidePriceEnabled: Action<this>
  toggleIsHidePriceForSoldWorksEnabled: Action<this>
  toggleIsHideUnpublishedWorksEnabled: Action<this>
  toggleIsHideWorksNotForSaleEnabled: Action<this>
  toggleIsHideWorksAvailabilityEnabled: Action<this>
  toggleIsHideConfidentialNotesEnabled: Action<this>
  toggleIsHideArtworkEditButtonEnabled: Action<this>
}

export const getPresentationModeModel = (): PresentationModeModel =>( {
  isPresenationModeEnabled: false,
  isHidePriceEnabled: true,
  isHidePriceForSoldWorksEnabled: true,
  isHideUnpublishedWorksEnabled: true,
  isHideWorksNotForSaleEnabled: true,
  isHideWorksAvailabilityEnabled: true,
  isHideConfidentialNotesEnabled: true,
  isHideArtworkEditButtonEnabled: true,

  hiddenItems: computed((state) => ({
    price: state.isPresenationModeEnabled && state.isHidePriceEnabled,
    priceForSoldWorks: state.isPresenationModeEnabled && state.isHidePriceForSoldWorksEnabled,
    unpublishedWorks: state.isPresenationModeEnabled && state.isHideUnpublishedWorksEnabled,
    worksNotForSale: state.isPresenationModeEnabled && state.isHideWorksNotForSaleEnabled,
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
  toggleIsHidePriceForSoldWorksEnabled: action((state) => {
    state.isHidePriceForSoldWorksEnabled = !state.isHidePriceForSoldWorksEnabled
  }),
  toggleIsHideUnpublishedWorksEnabled: action((state) => {
    state.isHideUnpublishedWorksEnabled = !state.isHideUnpublishedWorksEnabled
  }),
  toggleIsHideWorksNotForSaleEnabled: action((state) => {
    state.isHideWorksNotForSaleEnabled = !state.isHideWorksNotForSaleEnabled
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
})
