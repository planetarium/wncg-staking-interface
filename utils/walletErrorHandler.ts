export function walletErrorHandler(error: any, onError?: () => void) {
  switch (true) {
    case error?.code === 'ACTION_REJECTED':
    case error?.code === 4001:
    case error?.error === 'Rejected by user':
    case error?.cause?.code === 'ACTION_REJECTED':
    case error?.cause?.code === 4001:
    case error?.cause?.error === 'Rejected by user':
      return

    default:
      onError?.()
      throw error
  }
}
