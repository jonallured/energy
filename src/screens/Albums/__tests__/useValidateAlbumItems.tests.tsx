import { renderHook } from "@testing-library/react-native"
import { Alert } from "react-native"
import { useValidateAlbumItems } from "screens/Albums/useValidateAlbumItems"
import { useSystemFetchQuery } from "system/relay/useSystemFetchQuery"
import { GlobalStore } from "system/store/GlobalStore"

jest.mock("system/relay/useSystemFetchQuery")
jest.mock("lodash", () => ({
  ...jest.requireActual("lodash"),
  debounce: (fn: any) => () => fn(),
}))

jest.mock("system/store/GlobalStore", () => ({
  GlobalStore: {
    actions: {
      albums: {
        removeItemFromAlbums: jest.fn(),
      },
    },
  },
}))

describe("useValidateAlbumItems", () => {
  const mockUseSystemFetchQuery = useSystemFetchQuery as jest.Mock

  beforeEach(() => {
    mockUseSystemFetchQuery.mockReturnValue({
      data: ["1", "2", "3"],
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it("should remove items from albums and show an alert message if they have been deleted from CMS", async () => {
    const idsToValidate = ["1", "2", "3"]
    const mapResponseToIDs = jest.fn(() => ["1", "3"])
    const removeItemFromAlbumsMock = jest.fn()
    const alertSpy = jest.spyOn(Alert, "alert")
    GlobalStore.actions.albums.removeItemFromAlbums = removeItemFromAlbumsMock as any

    const query = `
      query {
        items {
          id
        }
      }
    ` as any

    const variables = { ids: idsToValidate }

    renderHook(() =>
      useValidateAlbumItems({
        query,
        variables,
        idsToValidate,
        mapResponseToIDs,
      })
    )

    expect(removeItemFromAlbumsMock).toHaveBeenCalledWith("2")

    expect(alertSpy).toHaveBeenCalledWith(
      "Items from this collection have been deleted in CMS.",
      "Your album has been updated."
    )
  })
})
