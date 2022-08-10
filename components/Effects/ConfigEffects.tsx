import { memo, useCallback, useEffect } from 'react'

import { useEventFilter, useFee, useProvider, useReward, useStake } from 'hooks'

function ConfigEffects() {
  const { feeUpdateEventFilter } = useEventFilter()
  const { earmarkIncentiveFee, feeDenominator } = useFee()
  const provider = useProvider()
  const {
    balRewardPool,
    earmarkIncentive,
    getBalEmissionPerSec,
    getWncgEmissionPerSec,
  } = useReward()
  const { stakedTokenAddress } = useStake()

  useEffect(() => {
    balRewardPool()
  }, [balRewardPool])

  useEffect(() => {
    stakedTokenAddress()
  }, [stakedTokenAddress])

  useEffect(() => {
    earmarkIncentiveFee()
  }, [earmarkIncentiveFee])

  useEffect(() => {
    feeDenominator()
  }, [feeDenominator])

  useEffect(() => {
    earmarkIncentive()
  }, [earmarkIncentive])

  useEffect(() => {
    getBalEmissionPerSec()
  }, [getBalEmissionPerSec])

  useEffect(() => {
    getWncgEmissionPerSec()
  }, [getWncgEmissionPerSec])

  const handleFeeUpdateEvent = useCallback(() => {
    earmarkIncentiveFee()
    feeDenominator()
  }, [earmarkIncentiveFee, feeDenominator])

  // NOTE: Fee Update event
  useEffect(() => {
    if (feeUpdateEventFilter) {
      provider?.on(feeUpdateEventFilter, handleFeeUpdateEvent)
      return () => {
        provider?.off(feeUpdateEventFilter)
      }
    }
  }, [feeUpdateEventFilter, handleFeeUpdateEvent, provider])

  return null
}

export default memo(ConfigEffects)
