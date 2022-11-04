import { useAtomValue } from 'jotai'

import { StakingContractData, stakingDataAtom } from 'states/staking'

const STAKING_DATA_PLACEHOLDER: StakingContractData = Object.freeze({
  earmarkIncentivePcnt: 0,
  emissions: [],
  liquidityGaugeAddress: '',
  rewardTokenAddress: '',
  rewardTokensList: [],
  rewardTokenDecimals: [],
  rewardTokenSymbols: [],
  stakedTokenAddress: '',
  cooldownWindowPeriod: 0,
  withdrawWindowPeriod: 0,
})

export function useStaking() {
  const stakingData = useAtomValue(stakingDataAtom)

  return stakingData ?? STAKING_DATA_PLACEHOLDER
}
