import { RenderResult } from "@testing-library/react-native"
import { QueryRenderer } from "react-relay"
import { GraphQLTaggedNode, OperationType } from "relay-runtime"
import { createMockEnvironment } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { mockEnvironmentPayload } from "app/utils/test/mockEnvironmentPayload"
import { renderWithWrappers } from "app/utils/test/renderWithWrappers"

export interface SetupTestWrapperProps<T extends OperationType> {
  Component: React.ComponentType<any>
  preloaded?: boolean
  query?: GraphQLTaggedNode
  variables?: T["variables"]
}

/**
 * Creates a test renderer which can be used to render a variety of relay
 * query configurations.
 *
 * @example - Full Queries
 *
 * const Foo = () => {
 *   const data = useLazyLoadQuery(graphql`
 *     query FooQuery {
 *       me {
 *         name
 *       }
 *     }
 *  `)
 *
 *  return <Text>{data.me.name}</Text>
 * }
 *
 * const { renderWithRelay } = setupTestWrapper({
 *   Component: Foo
 * })
 *
 * it('works', () => {
 *   const { getByText } = await renderWithRelay()
 *   expect(getByText('name')).toBeTruthy()
 * })
 *
 * @example - Using fragments
 *
 * const Bar = () => {
 *   const data = useFragment(graphql`
 *     fragment Bar_me on Me {
 *       name
 *     }
 *  `)
 *
 *  return <Text>{data.name}</Text>
 * }
 *
 * const { renderWithRelay } = setupTestWrapper({
 *   Component: Bar,
 *   query: graphql`
 *     query BarTestQuery @relay_test_operation {
 *       me {
 *         ...Bar_me
 *       }
 *     }
 *   `
 * })
 *
 * it('works', () => {
 *   const { getByText } = await renderWithRelay({
 *     Me: () => ({ name: 'Mock Name' })
 *   })
 *
 *   expect(getByText('name')).toEqual('Mock Name')
 * })
 */
export const setupTestWrapper = <T extends OperationType>({
  Component,
  preloaded = false,
  query,
  variables = {},
}: SetupTestWrapperProps<T>) => {
  const renderWithRelay = async (mockResolvers: MockResolvers = {}): Promise<RenderResult> => {
    const mockEnvironment = createMockEnvironment()

    const TestRenderer = () => {
      return (
        <>
          {query ? (
            <QueryRenderer<T>
              environment={mockEnvironment}
              variables={variables}
              query={query}
              render={({ props, error }) => {
                if (props) {
                  return <Component {...props} />
                } else if (error) {
                  console.error(error)
                }
              }}
            />
          ) : (
            <Component />
          )}
        </>
      )
    }

    const view = renderWithWrappers(<TestRenderer />, mockEnvironment)

    await mockEnvironmentPayload({
      mockEnvironment,
      mockResolvers,
      preloaded,
      query,
      variables,
    })

    return view
  }

  return { renderWithRelay }
}
