import { memo, useCallback, useEffect, useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import type { Event } from 'ethers'

import { accountState } from 'app/states/connection'
import { stakingContractAddressState } from 'app/states/settings'
import { configService } from 'services/config'
import { TxAction } from 'services/transaction'
import { useAllowances, useEvents, usePool, useProvider, useTx } from 'hooks'

function ApprovalEffects() {
  const { fetchAllowances } = useAllowances()
  const { createApprovalEvent } = useEvents()
  const { bptAddress, poolTokenAddresses } = usePool()
  const provider = useProvider()
  const { handleTx } = useTx()

  const account = useRecoilValue(accountState)
  const stakingAddress = useRecoilValue(stakingContractAddressState)

  const eventFilters = useMemo(() => {
    if (!account) return null

    return [
      ...poolTokenAddresses.map((address) =>
        createApprovalEvent(address, configService.vaultAddress)
      ),
      createApprovalEvent(bptAddress, stakingAddress),
    ]
  }, [
    account,
    bptAddress,
    createApprovalEvent,
    poolTokenAddresses,
    stakingAddress,
  ])

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
    eventFilters?.forEach((filter) => {
      if (!filter) return
      provider?.on(filter, eventHandler)
    })

    return () => {
      eventFilters?.forEach((filter) => {
        if (!filter) return
        provider?.off(filter)
      })
    }
  }, [eventFilters, eventHandler, provider])

  return null
}

export default memo(ApprovalEffects)
