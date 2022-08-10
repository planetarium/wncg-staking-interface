import { memo, useEffect } from 'react'

import { useUserBalances } from 'hooks'

function BalanceEffects() {
  const {
    fetchBptBalance,
    fetchEthBalance,
    fetchWethBalance,
    fetchWncgBalance,
  } = useUserBalances()

  useEffect(() => {
    fetchEthBalance()
  }, [fetchEthBalance])

  useEffect(() => {
    fetchBptBalance()
  }, [fetchBptBalance])

  useEffect(() => {
    fetchWethBalance()
  }, [fetchWethBalance])

  useEffect(() => {
    fetchWncgBalance()
  }, [fetchWncgBalance])

  return null
}

export default memo(BalanceEffects)
