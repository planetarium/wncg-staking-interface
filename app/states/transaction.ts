import { atom, selector } from 'recoil'

export const txListState = atom<Tx[]>({
  key: '#txList',
  default: [],
})

export const pendingTxListState = selector<Tx[]>({
  key: '#pendingTxList',
  get({ get }) {
    const list = get(txListState)
    return list.filter((tx) => tx.status === 'pending')
  },
})

export const unresolvedTxListState = selector<Tx[]>({
  key: '#unresolvedTxList',
  get({ get }) {
    const list = get(txListState)
    return list.filter((tx) => tx.status !== 'fulfilled').reverse()
  },
})
