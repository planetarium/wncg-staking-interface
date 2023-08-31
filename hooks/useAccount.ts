import { useCallback, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount as _useAccount } from 'wagmi'
import { useAtom, useSetAtom } from 'jotai'

import { accountAtom, connectorAtom, statusAtom } from 'states/account'
import { useRefetch } from './useRefetch'
import { useUserSettings } from './useUserSettings'

export function useAccount() {
  const queryClient = useQueryClient()

  const resetSettings = useUserSettings()

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
      })
    },
  })

  const updateAccount = useCallback(async () => {
    queryClient.removeQueries([account], { exact: false })

    resetSettings()
    setAccount(address ?? null)
    setConnector(_connector ?? null)
    setStatus(_status)

    // queryClient.invalidateQueries([address], { exact: false })

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
    setAccount,
    setConnector,
    setStatus,
  ])

  useEffect(() => {
    updateAccount()
  }, [updateAccount])
}
