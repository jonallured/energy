import { ErrorView } from "components/ErrorView"
import { GlobalErrorView } from "components/GlobalErrorView"
import { LoadFailureErrorView } from "components/LoadFailureErrorView"
import { Component } from "react"
import { GlobalStore } from "system/store/GlobalStore"

interface RetryErrorBoundaryProps {
  children: React.ReactNode
  withoutBackButton?: boolean
  isGlobal?: boolean

  Fallback?: React.ReactNode
  catch?: (error: Error) => void
}
interface RetryErrorBoundaryState {
  error: Error | null
}

export const GlobalRetryErrorBoundary: React.FC = ({ children }) => {
  return <RetryErrorBoundary isGlobal>{children}</RetryErrorBoundary>
}

//https://relay.dev/docs/guided-tour/rendering/error-states/#when-using-uselazyloadquery
export class RetryErrorBoundary extends Component<
  RetryErrorBoundaryProps,
  RetryErrorBoundaryState
> {
  state = { error: null }

  static getDerivedStateFromError(error: Error | null): RetryErrorBoundaryState {
    return { error: error }
  }

  _retry = () => {
    this.setState({ error: null })
    GlobalStore.actions.networkStatus.setRelayFetchKey()
  }

  render() {
    const { children, withoutBackButton, isGlobal } = this.props
    const { error } = this.state
    if (error) {
      const isNotFoundError = getErrorHttpStatusCodes(error).includes(404)

      if (isGlobal) {
        return <GlobalErrorView error={error} />
      }

      if (isNotFoundError) {
        return <ErrorView error={error} withoutBackButton={withoutBackButton} />
      }

      return <LoadFailureErrorView error={error} onRetry={this._retry} />
    }

    return children
  }
}

export const getErrorHttpStatusCodes = (error: any) => {
  return error?.res?.json?.errors?.[0]?.extensions?.httpStatusCodes || []
}
