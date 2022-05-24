import { GlobalStoreProvider } from "store/GlobalStore"
import { defaultEnvironment } from "relay/environment/defaultEnvironent"
import { Suspense } from "react"
import { render } from "@testing-library/react-native"
import { Theme } from "palette"
import { ReactElement } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { RelayEnvironmentProvider } from "react-relay"
import { combineProviders } from "utils/combineProviders"

const Wrappers: React.FC = ({ children }) =>
  combineProviders(
    [
      RelayMockEnvProvider,
      SuspenseProvider,
      GlobalStoreProvider,
      SafeAreaProvider,
      Theme, // uses: GlobalStoreProvider
    ],
    children
  )

const RelayMockEnvProvider = ({ children }: { children?: React.ReactNode }) => (
  <RelayEnvironmentProvider environment={defaultEnvironment}>{children}</RelayEnvironmentProvider>
)
const SuspenseProvider = ({ children }: { children?: React.ReactNode }) => (
  <Suspense fallback="Loading...">{children}</Suspense>
)

/**
 * Renders a React Component with our page wrappers
 * by using @testing-library/react-native
 * @param component
 */
export const renderWithWrappersTL = (component: ReactElement) => {
  try {
    return render(component, { wrapper: Wrappers })
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
