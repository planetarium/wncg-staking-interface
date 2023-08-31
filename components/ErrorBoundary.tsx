import { Component, ErrorInfo, ReactNode } from 'react'

import Error from './error'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: process.env.NODE_ENV === 'production' }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return <Error code={500} />
    }

    return this.props.children
  }
}

export default ErrorBoundary
