import { useAtomValue } from 'jotai'
import { usePrevious } from 'react-use'

import { accountAtom, connectorAtom, statusAtom } from 'states/account'

export function useAuth() {
  const account = useAtomValue(accountAtom)
  const connector = useAtomValue(connectorAtom)
  const status = useAtomValue(statusAtom)

  const prevAccount = usePrevious(account)

  return {
    account,
    prevAccount,
    connector,
    isConnected: status === null ? null : status === 'connected',
    isConnecting: status === null ? null : status === 'connecting',
    isDisconnected: status === null ? null : status === 'connected',
    isReconnected: status === null ? null : status === 'reconnecting',
    status,
  }
}
