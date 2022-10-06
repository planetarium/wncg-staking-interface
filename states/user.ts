import { atom } from 'jotai'

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
export const balancesAtom = atom<BalanceMap>({})
export const rewardsAtom = atom(['0', '0'])
export const stakedTokenBalancesAtom = atom<string[]>([])
export const timestampsAtom = atom([0, 0])
