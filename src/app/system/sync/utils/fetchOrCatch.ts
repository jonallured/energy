import { Environment, fetchQuery, GraphQLTaggedNode, VariablesOf } from "react-relay"
import {
  createOperationDescriptor,
  getRequest,
  OperationType,
  GraphQLTaggedNode as _GraphQLTaggedNode,
} from "relay-runtime"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"

export const initFetchOrCatch = (relayEnvironment: RelayModernEnvironment) => {
  const fetchOrCatch = async <TQuery extends OperationType>(
    query: GraphQLTaggedNode,
    variables: VariablesOf<TQuery>
  ): Promise<TQuery["response"]> => {
    try {
      const data = await fetch(query, variables)

      // Ensure that data is not garbage collected by Relay
      const operationDescriptor = createOperationDescriptor(
        getRequest(query as _GraphQLTaggedNode), // TODO: Fix type
        variables
      )
      relayEnvironment.retain(operationDescriptor)

      return data
    } catch (error) {
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
