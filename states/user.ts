import { atom } from 'jotai'
import { roundToNearestMinutes } from 'date-fns'

import { UnstakePhase } from 'constants/types'
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

export const isCooldownWindowAtom = atom((get) => {
  const unstakePhase = get(unstakePhaseAtom)
  return unstakePhase === UnstakePhase.CooldownWindow
})

export const isWithdrawWindowAtom = atom((get) => {
  const unstakePhase = get(unstakePhaseAtom)
  return unstakePhase === UnstakePhase.WithdrawWindow
})

export const isUnstakeWindowAtom = atom((get) => {
  const unstakePhase = get(unstakePhaseAtom)
  return unstakePhase !== UnstakePhase.Idle
})

export const roundedTimestampsAtom = atom((get) => {
  const [cooldownEndsAt, withdrawEndsAt] = get(timestampsAtom)
  return [
    roundToNearestMinutes(cooldownEndsAt, { roundingMethod: 'ceil' }),
    roundToNearestMinutes(withdrawEndsAt, { roundingMethod: 'floor' }),
  ]
})

// const nowAtom = atom(Date.now())
const nowAtom = atom(0)

export const unstakePhaseAtom = atom((get) => {
  const [cooldownEndsAt, withdrawEndsAt] = get(timestampsAtom)
  const now = get(nowAtom)

  switch (true) {
    case cooldownEndsAt > now:
      return UnstakePhase.CooldownWindow
    case withdrawEndsAt > now:
      return UnstakePhase.WithdrawWindow
    default:
      return UnstakePhase.Idle
  }
})
