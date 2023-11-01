import type { MouseEvent } from 'react'
import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import { useDisconnect as _useDisconnect } from 'wagmi'

import { accountAtom, connectorAtom, statusAtom } from 'states/account'
import { useResetSettings } from './useResetSettings'
import { useResetTx } from './useResetTx'

type UseDisconnectConfig = {
  onError?(error: Error, context: unknown): void
  onSuccess?(e: MouseEvent): void
}

export function useDisconnect({
  onError,
  onSuccess,
}: UseDisconnectConfig = {}) {
  const resetSettings = useResetSettings()
  const resetTx = useResetTx()

  const setAccount = useSetAtom(accountAtom)
  const setConnector = useSetAtom(connectorAtom)
  const setStatus = useSetAtom(statusAtom)

  const { disconnectAsync } = _useDisconnect({
    onSuccess() {
      setAccount(RESET)
      setConnector(RESET)
      setStatus('disconnected')
      resetSettings()
      resetTx()
    },
    onError,
  })

  async function disconnect(e: MouseEvent) {
    try {
      await disconnectAsync()
      onSuccess?.(e)
    } catch (error) {
      resetSettings()
      resetTx()

      throw error
    }
  }

  return disconnect
}
