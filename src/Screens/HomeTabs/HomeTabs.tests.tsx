import { renderWithWrappersTL } from "tests/renderWithWrappers"
import { HomeTabs } from "./HomeTabs"
import { RelayEnvironmentProvider } from "react-relay"
import { defaultEnvironment } from "relay/environment/defaultEnvironent"
import { createMockEnvironment } from "relay-test-utils"

jest.unmock("react-relay")

const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>

describe("HomeTabs", () => {
  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={mockEnvironment}>
      <HomeTabs />
    </RelayEnvironmentProvider>
  )

  it("renders without throwing an error", () => {
    renderWithWrappersTL(<TestRenderer />)
  })
})
