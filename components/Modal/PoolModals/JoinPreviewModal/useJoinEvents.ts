import { useCallback } from 'react'

import { configService } from 'services/config'
import { useAllowances, useEvents, usePool } from 'hooks'

export function useJoinEvents(send: any) {
  const { allowanceFor } = useAllowances()
  const { createApprovalEvent, poolBalanceChangedEvent } = useEvents()
  const { poolTokenAddresses, poolTokenSymbols } = usePool()

  const approvalFilters = poolTokenAddresses.map((address) => {
    if (allowanceFor(address, configService.vaultAddress)) return null
    return createApprovalEvent(address, configService.vaultAddress)
  })
  const approvalHandlers = poolTokenSymbols.map((symbol) => {
    return function () {
      send(`APPROVED_${symbol}`)
    }
  })

  const poolBalanceChangedHandler = useCallback(() => {
    send('COMPLETED')
  }, [send])

  const eventFilters = [...approvalFilters, poolBalanceChangedEvent]
  const eventHandlers = [...approvalHandlers, poolBalanceChangedHandler]

  return {
    eventFilters,
    eventHandlers,
  }
}
