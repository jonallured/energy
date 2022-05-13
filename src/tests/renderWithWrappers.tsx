import { GlobalStoreProvider } from "@store/GlobalStore"
import { render } from "@testing-library/react-native"
import { Theme } from "palette"
import { ReactElement, Suspense } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Environment, RelayEnvironmentProvider } from "react-relay"
import { combineProviders } from "@utils/combineProviders"

const Wrappers: React.FC = ({ children }) =>
  combineProviders(
    [
      GlobalStoreProvider,
      SafeAreaProvider,
      Theme, // uses: GlobalStoreProvider
    ],
    children
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

export const renderWithHookWrappersTL = (component: ReactElement, environment: Environment) => {
  const jsx = (
    <RelayEnvironmentProvider environment={environment}>
      <Suspense fallback="Loading...">{component}</Suspense>
    </RelayEnvironmentProvider>
  )
  return renderWithWrappersTL(jsx)
}
