import { Environment, fetchQuery, GraphQLTaggedNode, VariablesOf } from "react-relay"
import { RRNLRequestError } from "react-relay-network-modern"
import { createOperationDescriptor, getRequest, OperationType } from "relay-runtime"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"

export interface FetchError {
  query: GraphQLTaggedNode
  variables: any
  error: RRNLRequestError
}

interface FetchOrCatchProps {
  relayEnvironment: RelayModernEnvironment
  onError: (props: FetchError) => void
}

export const initFetchOrCatch = ({ relayEnvironment, onError }: FetchOrCatchProps) => {
  const fetchOrCatch = async <TQuery extends OperationType>(
    query: GraphQLTaggedNode,
    variables: VariablesOf<TQuery>
  ): Promise<TQuery["response"]> => {
    try {
      const data = await fetch(query, variables)

      // Ensure that data is not garbage collected by Relay
      const operationDescriptor = createOperationDescriptor(getRequest(query), variables)
      relayEnvironment.retain(operationDescriptor)

      return data
    } catch (error) {
      onError({ query, variables, error: error as RRNLRequestError })
      console.warn("[sync] Error fetching data:", { query, variables, error })
      return null
    }
  }

  const fetch = <TQuery extends OperationType>(
    query: GraphQLTaggedNode,
    variables: VariablesOf<TQuery>
  ): Promise<TQuery["response"]> => {
    return fetchQuery(relayEnvironment as Environment, query, variables).toPromise()
  }

  return {
    fetchOrCatch,
  }
}
