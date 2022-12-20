import fetchMock from "jest-fetch-mock"
import { GraphQLResponseErrors, MiddlewareNextFn } from "react-relay-network-modern"
import { __globalStoreTestUtils__ } from "app/system/store/GlobalStore"
import { checkAuthenticationMiddleware } from "./checkAuthenticationMiddleware"
import { GraphQLRequest } from "./types"

describe(checkAuthenticationMiddleware, () => {
  const middleware = checkAuthenticationMiddleware()

  const request: GraphQLRequest = {
    // @ts-ignore
    operation: {
      operationKind: "query",
    },
    getID: () => "xxx",
    fetchOpts: {
      headers: {
        "X-ACCESS-TOKEN": "token-value",
      },
    } as any,
  }

  it("calls signOut if there are errors", async () => {
    const errors: GraphQLResponseErrors = [
      { message: "The access token is invalid or has expired." },
    ]
    // @ts-ignore
    const relayResponse: RelayNetworkLayerResponse = { errors }

    const next: MiddlewareNextFn = () => Promise.resolve(relayResponse)
    fetchMock.mockResponseOnce("", { status: 401 })
    expect(fetchMock).toHaveBeenCalledTimes(0)
    await middleware(next)(request)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(__globalStoreTestUtils__?.dispatchedActions.map((x) => x.type)).toContain(
      "@thunk.auth.signOut(start)"
    )
    expect(__globalStoreTestUtils__?.dispatchedActions.map((x) => x.type)).toContain(
      "@thunk.auth.signOut(success)"
    )
  })

  it("passes through if there is no errors", async () => {
    const errors: GraphQLResponseErrors = []
    // @ts-ignore
    const relayResponse: RelayNetworkLayerResponse = { errors }

    const next: MiddlewareNextFn = () => Promise.resolve(relayResponse)

    const res = await middleware(next)(request)
    expect(res).toBe(relayResponse)
  })
})
