import { fireEvent } from "@testing-library/react-native"
import { SelectMode, isAllSelected, isSelected } from "components/SelectMode"
import { __globalStoreTestUtils__ } from "system/store/GlobalStore"
import { SelectedItemArtwork } from "system/store/Models/SelectModeModel"
import { renderWithWrappers } from "utils/test/renderWithWrappers"

jest.mock("react-native-safe-area-context")

describe("SelectMode", () => {
  it("renders Select All button when active", () => {
    __globalStoreTestUtils__?.injectState({
      selectMode: {
        sessionState: {
          isActive: true,
        },
      },
    })

    const { getByText } = renderWithWrappers(
      <SelectMode
        allSelected={false}
        selectAll={() => {}}
        unselectAll={() => {}}
        activeTab="foo"
      />
    )

    const selectAllButton = getByText("Select All")
    expect(selectAllButton).toBeDefined()
  })

  it("renders Unselect All button when active and allSelected is true", () => {
    __globalStoreTestUtils__?.injectState({
      selectMode: {
        sessionState: {
          isActive: true,
        },
      },
    })

    const { getByText } = renderWithWrappers(
      <SelectMode
        allSelected={true}
        selectAll={() => {}}
        unselectAll={() => {}}
        activeTab="foo"
      />
    )

    const unselectAllButton = getByText("Unselect All")
    expect(unselectAllButton).toBeDefined()
  })

  it("renders Select button when not active", () => {
    __globalStoreTestUtils__?.injectState({
      selectMode: {
        sessionState: {
          isActive: false,
        },
      },
    })

    const { getByText } = renderWithWrappers(
      <SelectMode
        allSelected={false}
        selectAll={() => {}}
        unselectAll={() => {}}
        activeTab="foo"
      />
    )

    const selectButton = getByText("Select")
    expect(selectButton).toBeDefined()
  })

  it("renders Cancel button when active", () => {
    __globalStoreTestUtils__?.injectState({
      selectMode: {
        sessionState: {
          isActive: true,
        },
      },
    })

    const { getByText } = renderWithWrappers(
      <SelectMode
        allSelected={false}
        selectAll={() => {}}
        unselectAll={() => {}}
        activeTab="foo"
      />
    )

    const selectButton = getByText("Select")
    fireEvent.press(selectButton)

    const cancelButton = getByText("Cancel")
    expect(cancelButton).toBeDefined()
  })

  it("activates select mode global state", () => {
    __globalStoreTestUtils__?.injectState({
      selectMode: {
        sessionState: {
          isActive: false,
        },
      },
    })

    const { getByText } = renderWithWrappers(
      <SelectMode
        allSelected={false}
        selectAll={() => {}}
        unselectAll={() => {}}
        activeTab="foo"
      />
    )

    const selectButton = getByText("Select")
    fireEvent.press(selectButton)
    expect(
      __globalStoreTestUtils__?.getCurrentState().selectMode.sessionState
        .isActive
    ).toBe(true)
  })

  it("calls unselectAll if all selected", () => {
    __globalStoreTestUtils__?.injectState({
      selectMode: {
        sessionState: {
          isActive: true,
        },
      },
    })
    const spy = jest.fn()

    const { getByText } = renderWithWrappers(
      <SelectMode
        allSelected={true}
        selectAll={jest.fn()}
        unselectAll={spy}
        activeTab="foo"
      />
    )

    const selectButton = getByText("Unselect All")
    fireEvent.press(selectButton)
    expect(spy).toHaveBeenCalled()
  })

  it("calls selectAll if allSelected=false", () => {
    __globalStoreTestUtils__?.injectState({
      selectMode: {
        sessionState: {
          isActive: true,
        },
      },
    })
    const spy = jest.fn()

    const { getByText } = renderWithWrappers(
      <SelectMode
        allSelected={false}
        selectAll={spy}
        unselectAll={jest.fn()}
        activeTab="foo"
      />
    )

    const selectButton = getByText("Select All")
    fireEvent.press(selectButton)
    expect(spy).toHaveBeenCalled()
  })
})

describe("isAllSelected", () => {
  it("returns true when all items are selected", () => {
    const selectedItems = [
      { internalID: 1 },
      { internalID: 2 },
      { internalID: 3 },
    ] as unknown as SelectedItemArtwork[]
    const items = [
      { internalID: 1 },
      { internalID: 2 },
      { internalID: 3 },
    ] as unknown as SelectedItemArtwork[]
    expect(isAllSelected(selectedItems, items)).toBe(true)
  })

  it("returns false when not all items are selected", () => {
    const selectedItems = [
      { internalID: 1 },
      { internalID: 2 },
    ] as unknown as SelectedItemArtwork[]
    const items = [
      { internalID: 1 },
      { internalID: 2 },
      { internalID: 3 },
    ] as unknown as SelectedItemArtwork[]
    expect(isAllSelected(selectedItems, items)).toBe(false)
  })
})

describe("isSelected", () => {
  it("returns true when item is selected", () => {
    const selectedItems = [
      { internalID: 1 },
      { internalID: 2 },
    ] as unknown as SelectedItemArtwork[]
    const item = { internalID: 1 } as unknown as SelectedItemArtwork
    expect(isSelected(selectedItems, item)).toBe(true)
  })

  it("returns false when item is not selected", () => {
    const selectedItems = [
      { internalID: 1 },
      { internalID: 2 },
    ] as unknown as SelectedItemArtwork[]
    const item = { internalID: 3 } as unknown as SelectedItemArtwork
    expect(isSelected(selectedItems, item)).toBe(false)
  })
})
