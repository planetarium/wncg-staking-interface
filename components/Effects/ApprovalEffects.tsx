import { memo, useCallback, useEffect, useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import type { Event } from 'ethers'

import { useAllowances, usePool, useProvider, useTransaction } from 'hooks'
import { accountState } from 'app/states/connection'
import { configService } from 'services/config'
import { createApprovalEventFilter } from 'utils/event'
import { TxAction } from 'services/transaction'

function ApprovalEffects() {
  const { fetchAllowances } = useAllowances()
  const { bptAddress, poolTokenAddresses } = usePool()
  const provider = useProvider()
  const { handleTx } = useTransaction()

  const account = useRecoilValue(accountState)

  const eventFilters = useMemo(
    () => [
      ...poolTokenAddresses.map((address) =>
        createApprovalEventFilter(account, address, configService.vaultAddress)
      ),
      createApprovalEventFilter(
        account,
        bptAddress,
        configService.stakingAddress
      ),
    ],
    [account, bptAddress, poolTokenAddresses]
  )

  const eventHandler = useCallback(
    async (event: Event) => {
      await handleTx?.(event, TxAction.Approve, {
        onTxEvent: fetchAllowances,
        onTxConfirmed: fetchAllowances,
      })
    },
    [fetchAllowances, handleTx]
  )

  useEffect(() => {
    eventFilters.forEach((filter) => {
      if (!filter) return
      provider?.on(filter, eventHandler)
    })

    return () => {
      eventFilters.forEach((filter) => {
        if (!filter) return
        provider?.off(filter)
      })
    }
  }, [eventFilters, eventHandler, provider])

  return null
}

export default memo(ApprovalEffects)
