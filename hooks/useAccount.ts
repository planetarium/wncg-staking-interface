import { useCallback, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount as _useAccount } from 'wagmi'
import { useAtom, useSetAtom } from 'jotai'

import { accountAtom, connectorAtom, statusAtom } from 'states/account'
import { useRefetch } from './useRefetch'
import { useResetTx } from './useResetTx'
import { useResetSettings } from './useResetSettings'

export function useAccount() {
  const queryClient = useQueryClient()

  const resetSettings = useResetSettings()
  const resetTx = useResetTx()
  const refetch = useRefetch({
    userAllowances: true,
    userBalances: true,
    userData: true,
    userRewards: true,
  })

  const [account, setAccount] = useAtom(accountAtom)
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
        resetTx()
      })
    },
  })

  const updateAccount = useCallback(async () => {
    queryClient.removeQueries([account], { exact: false })

    resetSettings()
    resetTx()

    setAccount(address ?? null)
    setConnector(_connector ?? null)
    setStatus(_status)

    if (address) {
      await refetch()
    }
  }, [
    _connector,
    _status,
    account,
    address,
    queryClient,
    refetch,
    resetSettings,
    resetTx,
    setAccount,
    setConnector,
    setStatus,
  ])

  useEffect(() => {
    updateAccount()
  }, [updateAccount])
}
