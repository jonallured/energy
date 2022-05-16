import React from "react"
import { renderWithWrappersTL } from "tests/renderWithWrappers"
import { HomeTabs } from "./HomeTabs"
import { RelayEnvironmentProvider } from "react-relay"
import { defaultEnvironment } from "relay/defaultEnvironent"
import { createMockEnvironment } from "relay-test-utils"

jest.unmock("react-relay")

const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>

describe(HomeTabs, () => {
  const getWrapper = () => {
    const tree = renderWithWrappersTL(
      <RelayEnvironmentProvider environment={mockEnvironment}>
        <HomeTabs />
      </RelayEnvironmentProvider>
    )
    return tree
  }

  it("renders without throwing an error", () => {
    getWrapper()
  })
})
