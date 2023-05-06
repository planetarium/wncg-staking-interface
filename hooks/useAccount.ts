import { useCallback, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount as _useAccount } from 'wagmi'
import { useSetAtom } from 'jotai'

import { accountAtom, connectorAtom, statusAtom } from 'states/account'
import { useUserSettings } from './useUserSettings'

export function useAccount() {
  const resetSettings = useUserSettings()
  const queryClient = useQueryClient()

  const setAccount = useSetAtom(accountAtom)
  const setConnector = useSetAtom(connectorAtom)
  const setStatus = useSetAtom(statusAtom)

  const {
    address,
    connector: _connector,
    status: _status,
  } = _useAccount({
    onConnect({ connector }) {
      connector?.on('change', () => {
        queryClient.removeQueries([address], { exact: false })
        resetSettings()
      })
    },
  })

  const updateAccount = useCallback(() => {
    resetSettings()
    setAccount(address ?? null)
    setConnector(_connector ?? null)
    setStatus(_status)

    queryClient.invalidateQueries([address], { exact: false })
  }, [
    _connector,
    _status,
    address,
    queryClient,
    resetSettings,
    setAccount,
    setConnector,
    setStatus,
  ])

  useEffect(updateAccount, [updateAccount])
}
