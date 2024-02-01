import {
  Disposable,
  Environment,
  fetchQuery,
  GraphQLTaggedNode,
  VariablesOf,
} from "react-relay"
import { RRNLRequestError } from "react-relay-network-modern"
import {
  createOperationDescriptor,
  getRequest,
  OperationType,
} from "relay-runtime"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"

export interface FetchError {
  query: GraphQLTaggedNode
  variables: any
  error: RRNLRequestError
}

interface FetchOrCatchProps {
  relayEnvironment: RelayModernEnvironment
  checkIfAborted: () => boolean
  onError: (props: FetchError) => void
  onComplete: (disposableQuery: Disposable) => void
}

export const initFetchOrCatch = ({
  relayEnvironment,
  onError,
  onComplete,
  checkIfAborted,
}: FetchOrCatchProps) => {
  const fetchOrCatch = async <TQuery extends OperationType>(
    query: GraphQLTaggedNode,
    variables: VariablesOf<TQuery>
  ): Promise<TQuery["response"]> => {
    // Ensure that data is not garbage collected by Relay
    const operationDescriptor = createOperationDescriptor(
      getRequest(query),
      variables
    )
    const disposable = relayEnvironment.retain(operationDescriptor)

    try {
      if (checkIfAborted()) {
        return false
      }

      const data = await fetch(query, variables)

      // Pass up relay's disposable ref to be called after we write to disk
      onComplete(disposable)

      return data
    } catch (error) {
      console.warn("[sync] Error fetching data:", { query, variables, error })

      onError({
        query,
        variables,
        error: error as RRNLRequestError,
      })

      disposable.dispose()
      return null
    }
  }

  const fetch = <TQuery extends OperationType>(
    query: GraphQLTaggedNode,
    variables: VariablesOf<TQuery>
  ): Promise<TQuery["response"]> => {
    return fetchQuery(
      relayEnvironment as Environment,
      query,
      variables
    ).toPromise()
  }

  return {
    fetchOrCatch,
  }
}
