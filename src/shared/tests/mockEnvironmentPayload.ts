import { act } from "@testing-library/react-native"
import { takeRight } from "lodash"
import { MockPayloadGenerator, createMockEnvironment } from "relay-test-utils"
import { MockResolverContext, MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { flushPromiseQueue } from "./flushPromiseQueue"

const counters: { [path: string]: number } = {}
const generateID = (pathComponents: readonly string[] | undefined) => {
  const path: string = pathComponents?.join(".") ?? "_GLOBAL_"
  const currentCounter = counters[path]
  counters[path] = currentCounter === undefined ? 1 : currentCounter + 1
  return counters[path]
}

/**
 * Used to generate results in an array.
 * Usage: ```
 * Artist: () => ({
 *   auctionResultsConnection: {
 *     edges: mockEdges(10), // <- this will generate an array with 10 results, all prefilled
 *   }
 * })
 * ```
 */
export const mockEdges = (length: number) => new Array(length).fill({ node: {} })

const paths: { [name: string]: string } = {}

const mockResolver = (ctx: MockResolverContext) => {
  const makePrefix = (path: string) => takeRight(path.split("."), length).join(".")

  const fullpath = (ctx.path?.join(".") ?? "_GLOBAL_").replace(".edges.node", "")
  let length = 1
  let prefix = makePrefix(fullpath)

  while (Object.keys(paths).includes(prefix) && paths[prefix] !== fullpath) {
    length += 1
    prefix = makePrefix(fullpath)
  }
  paths[prefix] = fullpath

  return `${prefix}-${generateID(ctx.path!)}`
}

const defaultMockResolvers: MockResolvers = {
  ID: (ctx) => mockResolver(ctx),
  String: (ctx) => mockResolver(ctx),
}

const createTestEnvironment = () => {
  const mockEnvironment = createMockEnvironment()
  return mockEnvironment
}

export let relayMockEnvironment = createMockEnvironment()

export const resetRelayMockEnvironment = () => {
  relayMockEnvironment = createTestEnvironment()
}

export async function mockEnvironmentPayload(mockResolvers?: MockResolvers) {
  act(() => {
    relayMockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, { ...defaultMockResolvers, ...mockResolvers })
    )
  })
  await flushPromiseQueue()
}
