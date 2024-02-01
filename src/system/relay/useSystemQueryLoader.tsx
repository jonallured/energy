import { RefreshControl } from "react-native"
import {
  FetchPolicy,
  GraphQLTaggedNode,
  VariablesOf,
  useLazyLoadQuery,
} from "react-relay"

import { CacheConfig, OperationType, RenderPolicy } from "relay-runtime"
import { useSystemFetchQuery } from "system/relay/useSystemFetchQuery"
import { GlobalStore } from "system/store/GlobalStore"

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
  const fetchKey = GlobalStore.useAppState(
    (state) => state.networkStatus.relayFetchKey
  )
  const fetchPolicy = GlobalStore.useAppState(
    (state) => state.networkStatus.relayFetchPolicy
  )!
  const isOnline = GlobalStore.useAppState(
    (state) => state.networkStatus.isOnline
  )

  // Load initial data, trigger suspense boundaries
  const data = useLazyLoadQuery<TQuery>(query, variables, {
    fetchKey,
    fetchPolicy,
    ...options,
  })

  // Then use a refetchable version for pull-to-refresh
  // TODO: Refactor app to only use useSystemFetchQuery, and remove suspense
  // boundaries; at that point we can simply rely on the `loading` prop.
  const {
    refetch,
    loading,
    data: refetchData,
  } = useSystemFetchQuery<TQuery>({
    refetchOnly: true,
    query,
    variables,
    cacheConfig: {
      fetchPolicy: "network-only",
    },
  })

  const refreshControl = isOnline ? (
    <RefreshControl
      refreshing={loading}
      onRefresh={() => {
        refetch()
      }}
    />
  ) : undefined

  return {
    data: refetchData || data,
    refetch,
    loading,
    refreshControl,
  }
}
