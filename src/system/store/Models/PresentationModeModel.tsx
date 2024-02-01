import { action, Action, Computed, computed } from "easy-peasy"

export interface PresentationModeModel {
  isPresentationModeEnabled: boolean
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

  toggleIsPresentationModeEnabled: Action<this>
  toggleIsHidePriceEnabled: Action<this>
  toggleIsHidePriceForSoldWorksEnabled: Action<this>
  toggleIsHideUnpublishedWorksEnabled: Action<this>
  toggleIsHideWorksNotForSaleEnabled: Action<this>
  toggleIsHideWorksAvailabilityEnabled: Action<this>
  toggleIsHideConfidentialNotesEnabled: Action<this>
  toggleIsHideArtworkEditButtonEnabled: Action<this>
}

export const getPresentationModeModel = (): PresentationModeModel => ({
  isPresentationModeEnabled: false,
  isHidePriceEnabled: true,
  isHidePriceForSoldWorksEnabled: true,
  isHideUnpublishedWorksEnabled: true,
  isHideWorksNotForSaleEnabled: true,
  isHideWorksAvailabilityEnabled: true,
  isHideConfidentialNotesEnabled: true,
  isHideArtworkEditButtonEnabled: true,

  hiddenItems: computed((state) => ({
    price: state.isPresentationModeEnabled && state.isHidePriceEnabled,
    priceForSoldWorks:
      state.isPresentationModeEnabled && state.isHidePriceForSoldWorksEnabled,
    unpublishedWorks:
      state.isPresentationModeEnabled && state.isHideUnpublishedWorksEnabled,
    worksNotForSale:
      state.isPresentationModeEnabled && state.isHideWorksNotForSaleEnabled,
    worksAvailability:
      state.isPresentationModeEnabled && state.isHideWorksAvailabilityEnabled,
    confidentialNotes:
      state.isPresentationModeEnabled && state.isHideConfidentialNotesEnabled,
    editArtwork:
      state.isPresentationModeEnabled && state.isHideArtworkEditButtonEnabled,
  })),

  toggleIsPresentationModeEnabled: action((state) => {
    state.isPresentationModeEnabled = !state.isPresentationModeEnabled
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
