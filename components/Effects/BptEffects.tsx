import { useEffect } from 'react'

import { useBpt, useStake } from 'hooks'

export function BptEffects() {
  const { allowance } = useBpt()
  const { stakedToken, totalStaked } = useStake()

  useEffect(() => {
    stakedToken()
  }, [stakedToken])

  useEffect(() => {
    allowance()
  }, [allowance])

  useEffect(() => {
    totalStaked()
  }, [totalStaked])

  return null
}
