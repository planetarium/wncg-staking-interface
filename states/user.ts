import { atom } from 'jotai'

import { configService } from 'services/config'

export type AllowanceMap = {
  [address: string]: boolean
}

export type AllowancesMap = {
  [spender: string]: AllowanceMap
}

export type BalanceMap = {
  [address: string]: string
}

export const allowancesAtom = atom<AllowancesMap>({})
export const etherBalanceAtom = atom<string>('')
export const tokenBalancesAtom = atom<BalanceMap>({})
export const rewardsAtom = atom(['0', '0'])
export const stakedTokenBalancesAtom = atom<string[]>([])
export const timestampsAtom = atom([0, 0])

// NOTE: Read-only Derived Atoms
export const balancesAtom = atom((get) => {
  const etherBalance = get(etherBalanceAtom)
  const tokenBalanceMap = get(tokenBalancesAtom)
  return {
    ...tokenBalanceMap,
    [configService.nativeAssetAddress]: etherBalance,
  }
})
