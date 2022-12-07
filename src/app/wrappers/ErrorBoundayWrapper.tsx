import { Component, FC } from "react"
import { ErrorView } from "app/sharedUI/screens/ErrorView"

export const ErrorBoundaryWrapper = (Component: FC) => (
  <ErrorBoundary>
    <Component />
  </ErrorBoundary>
)

// Taken from https://relay.dev/docs/guided-tour/rendering/error-states/#when-using-uselazyloadquery
interface ErrorBoundaryProps {
  children: React.ReactNode
  withoutBackButton?: boolean
}
interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state = { error: null }

  static getDerivedStateFromError(error: Error | null): ErrorBoundaryState {
    return { error }
  }

  render() {
    const { children, withoutBackButton } = this.props
    const { error } = this.state

    if (error) {
      return <ErrorView error={error} withoutBackButton={withoutBackButton} />
    }

    return children
  }
}
