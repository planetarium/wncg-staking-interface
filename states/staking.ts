import { atom } from 'jotai'
import { freezeAtom } from 'jotai/utils'

export type StakingContractData = {
  earmarkIncentivePcnt: number
  emissions: string[]
  liquidityGaugeAddress: Hash
  rewardTokenAddress: Hash
  rewardTokensList: Hash[]
  rewardTokenDecimals: number[]
  rewardTokenSymbols: string[]
  stakedTokenAddress: Hash
  cooldownWindowPeriod: number
  withdrawWindowPeriod: number
}

export const totalStakedAtom = atom('0')
export const stakingDataAtom = freezeAtom(
  atom<StakingContractData | null>(null)
)
