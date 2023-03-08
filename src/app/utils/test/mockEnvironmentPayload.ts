import { SetupTestWrapperProps } from "app/utils/test/setupTestWrapper"
import { takeRight } from "lodash"
import { MockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MockResolverContext, MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"

interface MockEnvironmentPayloadProps extends Omit<SetupTestWrapperProps<any>, "Component"> {
  mockEnvironment: MockEnvironment
  mockResolvers: MockResolvers
}

export function mockEnvironmentPayload({
  preloaded,
  mockEnvironment,
  query,
  variables,
  mockResolvers,
}: MockEnvironmentPayloadProps) {
  const resolve = preloaded
    ? mockEnvironment.mock.queueOperationResolver
    : mockEnvironment.mock.resolveMostRecentOperation

  if (preloaded) {
    if (!query) {
      throw new Error("A `query` is required when using `preloaded` prop.")
    }
    mockEnvironment.mock.queuePendingOperation(query, variables)
  }

  resolve((operation: any) => {
    return MockPayloadGenerator.generate(operation, {
      ...defaultMockResolvers,
      ...mockResolvers,
    })
  })
}

const counters: { [path: string]: number } = {}

const generateID = (pathComponents: readonly string[] | undefined) => {
  const path: string = pathComponents?.join(".") ?? "_GLOBAL_"
  const currentCounter = counters[path]
  counters[path] = currentCounter === undefined ? 1 : currentCounter + 1
  return counters[path]
}

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
