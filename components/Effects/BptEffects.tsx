import { useEffect } from 'react'

import { useBpt, useStake } from 'hooks'

export function BptEffects() {
  const { allowance, balanceOf, totalSupply } = useBpt()
  const { stakedToken, totalStaked } = useStake()

  useEffect(() => {
    stakedToken()
  }, [stakedToken])

  useEffect(() => {
    allowance()
  }, [allowance])

  useEffect(() => {
    balanceOf()
  }, [balanceOf])

  useEffect(() => {
    totalSupply()
  }, [totalSupply])

  useEffect(() => {
    totalStaked()
  }, [totalStaked])

  return null
}
