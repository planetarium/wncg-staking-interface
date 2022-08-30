import { memo, useCallback, useEffect, useMemo } from 'react'
import type { Event } from 'ethers'

import {
  useAllowances,
  useAppSelector,
  usePool,
  useProvider,
  useTransaction,
} from 'hooks'
import { getAccount } from 'app/states/connection'
import { configService } from 'services/config'
import { createApprovalEventFilter } from 'utils/event'
import { TransactionAction } from 'services/transaction'

function ApprovalEffects() {
  const { fetchAllowances } = useAllowances()
  const { bptAddress, poolTokenAddresses } = usePool()
  const provider = useProvider()
  const { updateTxStatus } = useTransaction()

  const account = useAppSelector(getAccount)

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
      await updateTxStatus?.(event, TransactionAction.Approve, {
        onFulfill: fetchAllowances,
      })
    },
    [fetchAllowances, updateTxStatus]
  )

  useEffect(() => {
    eventFilters.forEach((filter) => {
      if (!filter) return

      // console.log('>>>>>>>>>> ✅ Register: ', filter.address?.slice(0, 6))

      provider?.on(filter, eventHandler)
    })

    return () => {
      eventFilters.forEach((filter) => {
        if (!filter) return
        // console.log('>>>>>>>>>> 🏀 Unregister: ', filter.address?.slice(0, 6))
        provider?.off(filter)
      })
    }
  }, [eventFilters, eventHandler, provider])

  return null
}

export default memo(ApprovalEffects)
