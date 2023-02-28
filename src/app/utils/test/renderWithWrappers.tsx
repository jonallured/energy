import { render } from "@testing-library/react-native"
import { Providers } from "app/Providers"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { createMockEnvironment, MockEnvironment } from "relay-test-utils"

export const renderWithWrappers = (
  component: React.ReactNode,
  mockEnvironment?: MockEnvironment
) => {
  const environment = mockEnvironment ?? createMockEnvironment()

  try {
    return render(
      <Providers relayEnvironment={environment as unknown as RelayModernEnvironment}>
        {component}
      </Providers>
    )
  } catch (error: any) {
    if (error.message.includes("Element type is invalid")) {
      throw new Error(
        'Error: Relay test component failed to render. This may happen if you forget to add `jest.unmock("react-relay")` at the top ' +
          "of your test? or if the module you are testing is getting mocked in setupJest.ts" +
          "\n\n" +
          error
      )
    } else {
      throw new Error(error.stack)
    }
  }
}
