import { atom } from 'jotai'

import { configService } from 'services/config'
import { uniqAddress } from 'utils/address'
import { bnum } from 'utils/num'
import { getTokenInfo } from 'utils/token'
import { legacyModeAtom } from './userSettings'

export const claimableTokensAtom = atom('0')

export const earmarkIncentivePcntAtom = atom(0.01)

export const emissionListAtom = atom(['0', '0'])

export const liquidityGaugeAddressAtom = atom('')

export const rewardTokenAddressAtom = atom('')

export const stakedTokenAddressAtom = atom('')

export const totalStakedAtom = atom('0')

export const unstakeWindowAtom = atom(0)

// NOTE: Read-only Derived Atoms
export const earmarkIncentiveAtom = atom((get) => {
  const claimableTokens = get(claimableTokensAtom)
  const pcnt = get(earmarkIncentivePcntAtom)
  const amount = bnum(claimableTokens).times(pcnt)
  return amount.isFinite() && !amount.isNaN() ? amount.toNumber() : 0
})

export const rewardTokensListAtom = atom((get) =>
  uniqAddress([get(rewardTokenAddressAtom), configService.bal])
)

export const rewardTokenDecimalsAtom = atom((get) =>
  get(rewardTokensListAtom).map((address) => getTokenInfo(address).decimals)
)

export const rewardTokenSymbolsAtom = atom((get) =>
  get(rewardTokensListAtom).map((address) => getTokenInfo(address).symbol)
)

export const stakingContractAddressAtom = atom((get) =>
  get(legacyModeAtom)
    ? configService.legacyStakingAddress
    : configService.stakingAddress
)
