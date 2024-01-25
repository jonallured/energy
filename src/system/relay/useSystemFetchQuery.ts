import { useEffect, useRef, useState } from "react"
import { Environment, GraphQLTaggedNode, fetchQuery, useRelayEnvironment } from "react-relay"
import { CacheConfig, FetchQueryFetchPolicy, OperationType } from "relay-runtime"
import { GlobalStore } from "system/store/GlobalStore"
import { useUpdateEffect } from "utils/hooks/useUpdateEffect"

export interface UseSystemFetchQueryProps<T extends OperationType> {
  environment?: Environment
  query: GraphQLTaggedNode
  variables?: T["variables"]
  cacheConfig?: {
    networkCacheConfig?: CacheConfig | null | undefined
    fetchPolicy?: FetchQueryFetchPolicy | null | undefined
  } | null
  // Skip initial fetch
  refetchOnly?: boolean
}

export const useSystemFetchQuery = <T extends OperationType>({
  environment,
  query,
  variables = {},
  cacheConfig = {},
  refetchOnly = false,
}: UseSystemFetchQueryProps<T>) => {
  const fetchPolicy = GlobalStore.useAppState(
    (state) => state.networkStatus.relayFetchPolicy
  )! as FetchQueryFetchPolicy

  const relayEnvironment = useRelayEnvironment()

  const [data, setData] = useState<T["response"] | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(refetchOnly ? false : true)

  const key = useRef(JSON.stringify(variables))
  const prevKey = useRef(key.current)

  useUpdateEffect(() => {
    key.current = JSON.stringify(variables)
  }, [variables])

  const refetch = async (updateVariables = {}) => {
    setLoading(true)

    try {
      const res = await fetchQuery<T>(
        (environment || relayEnvironment) as unknown as Environment,
        query,
        {
          ...variables,
          ...updateVariables,
        },
        {
          fetchPolicy,
          ...cacheConfig,
        }
      ).toPromise()

      setData(res)
      setLoading(false)
    } catch (err: any) {
      setError(err)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (key.current !== prevKey.current) {
      setData(null)
      setError(null)
      setLoading(true)

      prevKey.current = key.current
    }

    if (refetchOnly || data || error) {
      return
    }

    refetch()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheConfig, data, environment, error, query, relayEnvironment, refetchOnly, variables])

  return {
    data,
    error,
    loading,
    refetch,
  }
}
