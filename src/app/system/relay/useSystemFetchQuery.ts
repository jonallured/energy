import { useEffect, useState } from "react"
import { GraphQLTaggedNode, VariablesOf, fetchQuery, useRelayEnvironment } from "react-relay"
import { CacheConfig, FetchQueryFetchPolicy, OperationType, RenderPolicy } from "relay-runtime"
import { GlobalStore } from "app/system/store/GlobalStore"
import { useIsOnline } from "app/utils/hooks/useIsOnline"

/**
 * In order to handle more fine-grained errors we need to use `useSystemFetchQuery`
 * instead of `useLazyLoadQuery`. This is because `useLazyLoadQuery` will throw at
 * the suspense level which makes derived errors more difficult to catch and
 * respond to.
 *
 * @example
 *
 * const response = useSystemFetchQuery({
 *   query: MyQuery,
 *   variables: { id: "123" }
 *   onError: (error) => doSomethingWithError(error)
 * })
 */

interface UseSystemFetchQueryProps<TQuery extends OperationType> {
  query: GraphQLTaggedNode
  variables: VariablesOf<TQuery>
  cacheConfig?: {
    fetchKey?: string | number | undefined
    fetchPolicy?: FetchQueryFetchPolicy | undefined
    networkCacheConfig?: CacheConfig | undefined
    UNSTABLE_renderPolicy?: RenderPolicy | undefined
  }
  onError?: (error: any) => void
}

export function useSystemFetchQuery<TQuery extends OperationType>({
  query,
  variables,
  cacheConfig,
  onError,
}: UseSystemFetchQueryProps<TQuery>) {
  const [response, setResponse] = useState<TQuery["response"] | null>(null)
  const environment = useRelayEnvironment()
  const fetchPolicy = GlobalStore.useAppState(
    (state) => state.networkStatus.relayFetchPolicy
  )! as FetchQueryFetchPolicy

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchQuery<TQuery>(environment, query, variables, {
          ...cacheConfig,
          fetchPolicy,
        }).toPromise()

        setResponse(data)
      } catch (error: any) {
        console.log("[useSystemFetchQuery] Error:", error)

        if (onError) {
          onError(error)
        }
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(variables)])

  return response
}
