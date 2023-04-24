import type { MouseEvent } from 'react'
import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import { useDisconnect as _useDisconnect } from 'wagmi'

import { accountAtom, connectorAtom, statusAtom } from 'states/account'
import { useTx } from './useTx'
import { useUserSettings } from './useUserSettings'

type UseDisconnectConfig = {
  onError?(error: Error, context: unknown): void
  onSuccess?(e: MouseEvent): void
}

export function useDisconnect({
  onError,
  onSuccess,
}: UseDisconnectConfig = {}) {
  const { resetTx } = useTx()
  const resetSettings = useUserSettings()

  const setAccount = useSetAtom(accountAtom)
  const setConnector = useSetAtom(connectorAtom)
  const setStatus = useSetAtom(statusAtom)

  const { disconnectAsync } = _useDisconnect({
    onSuccess() {
      setAccount(RESET)
      setConnector(RESET)
      setStatus('disconnected')

      resetTx()
      resetSettings()
    },
    onError,
  })

  async function disconnect(e: MouseEvent) {
    try {
      await disconnectAsync()
      onSuccess?.(e)
    } catch (error) {
      throw error
    }
  }

  return disconnect
}
