import { fetchQuery, GraphQLTaggedNode } from "react-relay"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { initFetchOrCatch } from "system/sync/utils/fetchOrCatch"

jest.mock("react-relay")

describe("fetchOrCatch", () => {
  console.warn = jest.fn()

  const fetchQueryMock = fetchQuery as jest.Mock

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("triggers onError callback on error", () => {
    const onErrorSpy = jest.fn()

    fetchQueryMock.mockImplementation(() => {
      throw new Error("Error fetching data")
    })

    const { fetchOrCatch } = initFetchOrCatch({
      relayEnvironment: jest.fn() as unknown as RelayModernEnvironment,
      onError: onErrorSpy,
      checkIfAborted: jest.fn().mockReturnValue(false),
    })

    const query = "query" as unknown as GraphQLTaggedNode
    const variables = { foo: "bar" }

    try {
      fetchOrCatch(query, variables)
    } catch (error) {
      expect(onErrorSpy).toHaveBeenCalledWith({ query, variables, error })
    }
  })
})
