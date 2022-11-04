import { atom } from 'jotai'
import { freezeAtom } from 'jotai/utils'

import { configService } from 'services/config'
import { legacyModeAtom } from './userSettings'

export type StakingContractData = {
  earmarkIncentivePcnt: number
  emissions: string[]
  liquidityGaugeAddress: string
  rewardTokenAddress: string
  rewardTokensList: string[]
  rewardTokenDecimals: number[]
  rewardTokenSymbols: string[]
  stakedTokenAddress: string
  cooldownWindowPeriod: number
  withdrawWindowPeriod: number
}

export const totalStakedAtom = atom('0')
export const stakingDataAtom = freezeAtom(
  atom<StakingContractData | null>(null)
)

// NOTE: Read-only Derived Atom
export const stakingContractAddressAtom = atom((get) =>
  get(legacyModeAtom)
    ? configService.legacyStakingAddress
    : configService.stakingAddress
)
