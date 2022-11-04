import { atom } from 'jotai'
import { atomWithReset } from 'jotai/utils'

export const txListAtom = atomWithReset<Tx[]>([])

// NOTE: Read-only Derived Atoms
export const pendingTxListAtom = atom<Tx[]>((get) => {
  const list = get(txListAtom)
  return list.filter((tx) => tx.status === 'pending')
})

export const unresolvedTxListAtom = atom<Tx[]>((get) => {
  const list = get(txListAtom)
  return list.filter((tx) => tx.status !== 'fulfilled').reverse()
})
