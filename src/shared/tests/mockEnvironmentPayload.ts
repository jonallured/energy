import { act } from "@testing-library/react-native"
import { takeRight } from "lodash"
import { MockPayloadGenerator, RelayMockEnvironment } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { defaultEnvironment } from "app/relay/environment/defaultEnvironent"
import { flushPromiseQueue } from "./flushPromiseQueue"

let counters: { [path: string]: number } = {}
const reset = () => {
  counters = {}
  paths = {}
}
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

interface MockResolverContext {
  parentType?: string | undefined
  name?: string | undefined
  alias?: string | undefined
  path?: ReadonlyArray<string> | undefined
  args?: { [key: string]: any } | undefined
}

let paths: { [name: string]: string } = {}
const goodMockResolver = (ctx: MockResolverContext) => {
  const makePrefix = (path: string) => takeRight(path.split("."), length).join(".")

  const fullpath = (ctx.path?.join(".") ?? "_GLOBAL_").replace(".edges.node", "")
  let length = 1
  let prefix = makePrefix(fullpath)

  while (Object.keys(paths).includes(prefix) && paths[prefix] !== fullpath) {
    length += 1
    prefix = makePrefix(fullpath)
  }
  paths[prefix] = fullpath

  return `${prefix}-${generateID(ctx.path)}`
}

const DefaultMockResolvers: MockResolvers = {
  ID: (ctx) => goodMockResolver(ctx),
  String: (ctx) => goodMockResolver(ctx),
}

export async function mockEnvironmentPayloadMaybe(mockResolvers?: MockResolvers) {
  act(() => {
    // here, the defaultEnv is actually the mockEnv. See setupJest.ts for more info.
    ;(defaultEnvironment as RelayMockEnvironment).mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, { ...DefaultMockResolvers, ...mockResolvers })
    )
  })
  await flushPromiseQueue()
}
