import { useEffect } from 'react'

import { useBpt, useStake } from 'hooks'

export function BptEffects() {
  const { allowance, totalSupply } = useBpt()
  const { stakedToken, totalStaked } = useStake()

  useEffect(() => {
    stakedToken()
  }, [stakedToken])

  useEffect(() => {
    allowance()
  }, [allowance])

  useEffect(() => {
    totalSupply()
  }, [totalSupply])

  useEffect(() => {
    totalStaked()
  }, [totalStaked])

  return null
}
