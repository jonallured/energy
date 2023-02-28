import { GlobalStore } from "app/system/store/GlobalStore"
import { FetchPolicy, GraphQLTaggedNode, VariablesOf, useLazyLoadQuery } from "react-relay"

import { CacheConfig, OperationType, RenderPolicy } from "relay-runtime"

/**
 * A wrapper around useLazyLoadQuery that uses the global fetch policy in order
 * to manage the online/offline state of the app.
 */
export function useSystemQueryLoader<TQuery extends OperationType>(
  query: GraphQLTaggedNode,
  variables: VariablesOf<TQuery>,
  options?: {
    fetchKey?: string | number | undefined
    fetchPolicy?: FetchPolicy | undefined
    networkCacheConfig?: CacheConfig | undefined
    UNSTABLE_renderPolicy?: RenderPolicy | undefined
  }
) {
  const fetchKey = GlobalStore.useAppState((state) => state.networkStatus.relayFetchKey)
  const fetchPolicy = GlobalStore.useAppState((state) => state.networkStatus.relayFetchPolicy)!
  const response = useLazyLoadQuery<TQuery>(query, variables, { fetchKey, fetchPolicy, ...options })
  return response
}
