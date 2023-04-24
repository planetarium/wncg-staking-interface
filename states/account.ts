import { atom } from 'jotai'
import { atomWithReset } from 'jotai/utils'
import type { Connector } from '@wagmi/core'

import { currentTimestampAtom } from './system'

export const accountAtom = atomWithReset<Hash | null>(null)
export const connectorAtom = atomWithReset<Connector | null>(null)
export const statusAtom = atomWithReset<ConnectionStatus | null>(null)

export const unstakeTimestampsAtom = atomWithReset<UnstakeTimestamps | null>(
  null
)

export const cooldownWindowAtom = atom((get) => {
  const currentTimestamp = get(currentTimestampAtom)
  const unstakeTimestamps = get(unstakeTimestampsAtom)

  if (unstakeTimestamps == null) return false
  if (!unstakeTimestamps.cooldownEndsAt) return false
  if (!unstakeTimestamps.withdrawEndsAt) return false

  return unstakeTimestamps.cooldownEndsAt - currentTimestamp > 0
})

export const withdrawWindowAtom = atom((get) => {
  const currentTimestamp = get(currentTimestampAtom)
  const unstakeTimestamps = get(unstakeTimestampsAtom)

  if (unstakeTimestamps == null) return false
  if (!unstakeTimestamps.withdrawEndsAt) return false

  return (
    unstakeTimestamps.withdrawEndsAt - currentTimestamp > 0 &&
    currentTimestamp - unstakeTimestamps.cooldownEndsAt >= 0
  )
})

export const isUnstakeWindowAtom = atom((get) => {
  const cooldownWindow = get(cooldownWindowAtom)
  const unstakeWindow = get(withdrawWindowAtom)
  return cooldownWindow || unstakeWindow
})
