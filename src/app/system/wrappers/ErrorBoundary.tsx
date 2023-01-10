import { Component } from "react"
import { ErrorView } from "app/components/ErrorView"

// Taken from https://relay.dev/docs/guided-tour/rendering/error-states/#when-using-uselazyloadquery
interface ErrorBoundaryProps {
  children: React.ReactNode
  withoutBackButton?: boolean

  Fallback?: React.ReactNode
  catch?: (error: Error) => void
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
    const { children, withoutBackButton, Fallback } = this.props
    const { error } = this.state

    if (error) {
      this.props.catch?.(error)

      if (Fallback !== undefined) {
        return Fallback
      }

      return <ErrorView error={error} withoutBackButton={withoutBackButton} />
    }

    return children
  }
}
