import { GlobalStore, __globalStoreTestUtils__ } from "app/system/store/GlobalStore"
import { SelectedItem } from "app/system/store/Models/SelectModeModel"

describe("SelectModeModel", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectState({
      selectMode: {
        sessionState: {
          isActive: false,
          selectedItems: [],
        },
      },
    })
  })

  it("#toggleSelectMode", () => {
    GlobalStore.actions.selectMode.toggleSelectMode()
    expect(__globalStoreTestUtils__?.getCurrentState().selectMode.sessionState.isActive).toBe(true)

    GlobalStore.actions.selectMode.toggleSelectMode()
    expect(__globalStoreTestUtils__?.getCurrentState().selectMode.sessionState.isActive).toBe(false)
  })

  it("#cancelSelectMode", () => {
    GlobalStore.actions.selectMode.toggleSelectMode()
    GlobalStore.actions.selectMode.selectItems([{ internalID: "1" }] as SelectedItem[])

    GlobalStore.actions.selectMode.cancelSelectMode()
    expect(__globalStoreTestUtils__?.getCurrentState().selectMode.sessionState.isActive).toBe(false)
    expect(
      __globalStoreTestUtils__?.getCurrentState().selectMode.sessionState.selectedItems
    ).toEqual([])
  })

  it("#toggleSelectedItem", () => {
    const selectedItem = { internalID: "1" } as SelectedItem
    GlobalStore.actions.selectMode.toggleSelectedItem(selectedItem)

    expect(
      __globalStoreTestUtils__?.getCurrentState().selectMode.sessionState.selectedItems
    ).toEqual([selectedItem])

    GlobalStore.actions.selectMode.toggleSelectedItem(selectedItem)

    expect(
      __globalStoreTestUtils__?.getCurrentState().selectMode.sessionState.selectedItems
    ).toEqual([])
  })

  it("#selectItems", () => {
    const selectedItem = { internalID: "1" } as SelectedItem
    GlobalStore.actions.selectMode.selectItems([selectedItem, selectedItem])

    expect(
      __globalStoreTestUtils__?.getCurrentState().selectMode.sessionState.selectedItems
    ).toEqual([selectedItem, selectedItem])
  })

  it("#selectItems", () => {
    GlobalStore.actions.selectMode.setIsActive(true)
    expect(__globalStoreTestUtils__?.getCurrentState().selectMode.sessionState.isActive).toEqual(
      true
    )

    GlobalStore.actions.selectMode.setIsActive(false)
    expect(__globalStoreTestUtils__?.getCurrentState().selectMode.sessionState.isActive).toEqual(
      false
    )
  })

  it("#clearSelectedItems", () => {
    const selectedItem = { internalID: "1" } as SelectedItem
    GlobalStore.actions.selectMode.selectItems([selectedItem, selectedItem])
    GlobalStore.actions.selectMode.clearSelectedItems()

    expect(
      __globalStoreTestUtils__?.getCurrentState().selectMode.sessionState.selectedItems
    ).toEqual([])
  })
})
