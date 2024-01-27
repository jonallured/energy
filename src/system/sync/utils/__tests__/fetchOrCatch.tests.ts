import { fetchQuery, GraphQLTaggedNode } from "react-relay"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { initFetchOrCatch } from "system/sync/utils/fetchOrCatch"

jest.mock("react-relay")
jest.mock("relay-runtime", () => ({
  ...jest.requireActual("relay-runtime"),
  createOperationDescriptor: jest.fn(),
  getRequest: jest.fn(),
}))

describe("fetchOrCatch", () => {
  console.warn = jest.fn()

  const fetchQueryMock = fetchQuery as jest.Mock

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("triggers onError callback on error", () => {
    const onErrorSpy = jest.fn()
    const disposableSpy = jest.fn().mockReturnValue({ dispose: jest.fn() })

    fetchQueryMock.mockImplementation(() => {
      throw new Error("Error fetching data")
    })

    const { fetchOrCatch } = initFetchOrCatch({
      relayEnvironment: { retain: disposableSpy } as unknown as RelayModernEnvironment,
      onError: onErrorSpy,
      checkIfAborted: jest.fn().mockReturnValue(false),
      onComplete: jest.fn(),
    })

    const query = "query" as unknown as GraphQLTaggedNode
    const variables = { foo: "bar" }

    try {
      fetchOrCatch(query, variables)
    } catch (error) {
      expect(onErrorSpy).toHaveBeenCalledWith({ query, variables, error })
    }
  })

  it("triggers onComplete callback on success", async () => {
    const disposableSpy = jest.fn()
    const retainSpy = jest.fn().mockReturnValue({ dispose: disposableSpy })
    const onCompleteSpy = jest.fn()

    fetchQueryMock.mockImplementation(() => {
      return {
        toPromise: jest.fn().mockResolvedValue({ data: "data" }),
      }
    })

    const { fetchOrCatch } = initFetchOrCatch({
      relayEnvironment: { retain: retainSpy } as unknown as RelayModernEnvironment,
      onError: jest.fn(),
      checkIfAborted: jest.fn().mockReturnValue(false),
      onComplete: onCompleteSpy,
    })

    const query = "query" as unknown as GraphQLTaggedNode
    const variables = { foo: "bar" }

    await fetchOrCatch(query, variables)

    expect(retainSpy).toHaveBeenCalled()
    expect(onCompleteSpy).toHaveBeenCalled()
  })
})
