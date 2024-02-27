import { RouteNames } from "Navigation"
import { ArtistArtworksOfflineQuery$data } from "__generated__/ArtistArtworksOfflineQuery.graphql"
import { ArtistDocumentsQuery$data } from "__generated__/ArtistDocumentsQuery.graphql"
import { ShowInstallsQuery$data } from "__generated__/ShowInstallsQuery.graphql"
import { action, Action, Thunk, thunk, thunkOn, ThunkOn } from "easy-peasy"
import { GlobalStoreModel } from "system/store/Models/GlobalStoreModel"

export interface SelectModeModel {
  sessionState: {
    activeTab: RouteNames | ""
    activeTabItems: Array<SelectedItem>
    isActive: boolean
    selectedItems: Array<SelectedItem>
  }

  // Actions
  toggleSelectMode: Thunk<this>
  cancelSelectMode: Thunk<this>
  toggleSelectedItem: Action<this, SelectedItem>
  selectItems: Action<this, Array<SelectedItem>>
  setActiveTab: Action<
    this,
    {
      activeTab: SelectModeModel["sessionState"]["activeTab"]
      activeTabItems: SelectModeModel["sessionState"]["activeTabItems"]
    }
  >
  setIsActive: Action<this, this["sessionState"]["isActive"]>
  clearSelectedItems: Action<this>

  // listeners
  onAlbumCreated: ThunkOn<this, null, GlobalStoreModel>
}

export const getSelectModeModel = (): SelectModeModel => ({
  sessionState: {
    activeTab: "",
    activeTabItems: [],
    isActive: false,
    selectedItems: [],
  },

  toggleSelectMode: thunk((actions, _, { getState }) => {
    const newValue = !getState().sessionState.isActive
    actions.setIsActive(newValue)
    if (newValue === false) {
      actions.clearSelectedItems()
    }
  }),

  setActiveTab: action((state, { activeTab, activeTabItems }) => {
    state.sessionState.activeTab = activeTab
    state.sessionState.activeTabItems = activeTabItems
  }),

  cancelSelectMode: thunk((actions) => {
    actions.setIsActive(false)
    actions.clearSelectedItems()
  }),

  toggleSelectedItem: action((state, item) => {
    const foundItem = state.sessionState.selectedItems.find(
      (selectedItems) => selectedItems?.internalID === item?.internalID
    )

    if (foundItem) {
      state.sessionState.selectedItems =
        state.sessionState.selectedItems.filter(
          (selectedItem) => selectedItem?.internalID !== item?.internalID
        )
    } else {
      state.sessionState.selectedItems.push(item)
    }
  }),

  selectItems: action((state, items) => {
    state.sessionState.selectedItems = items
  }),

  setIsActive: action((state, value) => {
    state.sessionState.isActive = value
  }),

  clearSelectedItems: action((state) => {
    state.sessionState.selectedItems = []
  }),

  // Listeners

  /**
   * When an album is created or artworks are added, we want to exit select mode.
   */
  onAlbumCreated: thunkOn(
    (_actions, storeActions) => [
      storeActions.albums.addItemsToAlbums,
      storeActions.albums.addAlbum,
      storeActions.albums.editAlbum,
    ],
    (actions) => {
      actions.cancelSelectMode()
    }
  ),
})

// Overly verbose, but the only way to mark MP types as non-nullable in order to
// map to the same type in the store.
export type SelectedItem =
  // Artwork
  | NonNullable<
      NonNullable<
        NonNullable<
          NonNullable<
            ArtistArtworksOfflineQuery$data["partner"]
          >["artworksConnection"]
        >["edges"]
      >[0]
    >["node"]
  // Document
  | NonNullable<
      NonNullable<
        NonNullable<
          NonNullable<
            ArtistDocumentsQuery$data["partner"]
          >["documentsConnection"]
        >["edges"]
      >[0]
    >["node"]
  // Installs
  | NonNullable<
      NonNullable<NonNullable<ShowInstallsQuery$data["show"]>["images"]>[0]
    >

export type SelectedItemArtwork = Extract<
  SelectedItem,
  { __typename: "Artwork" }
>
export type SelectedItemInstall = Extract<SelectedItem, { __typename: "Image" }>
export type SelectedItemDocument = Extract<
  SelectedItem,
  { __typename: "PartnerDocument" }
>
