import { memo, useCallback, useEffect, useMemo } from 'react'
import type { Event } from 'ethers'

import {
  useAllowances,
  useAppSelector,
  usePoolService,
  useProvider,
  useTransaction,
} from 'hooks'
import { getAccount } from 'app/states/connection'
import { configService } from 'services/config'
import { createApprovalEventFilter } from 'utils/event'

function ApprovalEffects() {
  const { fetchAllowances } = useAllowances()
  const { bptAddress, poolTokenAddresses } = usePoolService()
  const provider = useProvider()
  const { transactionService } = useTransaction()

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
      await transactionService?.updateTxStatus(event, {
        onFulfill: fetchAllowances,
      })
    },
    [fetchAllowances, transactionService]
  )

  useEffect(() => {
    eventFilters.forEach((filter) => {
      if (!filter) return

      console.log('>>>>>>>>>> ✅ Register: ', filter.address?.slice(0, 6))

      provider?.on(filter, eventHandler)
    })

    return () => {
      eventFilters.forEach((filter) => {
        if (!filter) return
        console.log('>>>>>>>>>> 🏀 Unregister: ', filter.address?.slice(0, 6))
        provider?.off(filter)
      })
    }
  }, [eventFilters, eventHandler, provider])

  return null
}

export default memo(ApprovalEffects)
