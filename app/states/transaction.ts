import { atom, selector } from 'recoil'
import { TxMap } from 'services/transaction'

export const txMapState = atom<TxMap>({
  key: '#txMap',
  default: {},
})

export const pendingTxListState = selector<Transaction[]>({
  key: '#pendingTxList',
  get({ get }) {
    const txMap = get(txMapState)
    return Object.values(txMap).filter((tx) => tx.status === 'pending')
  },
})

export const unresolvedTxListState = selector<Transaction[]>({
  key: '#unresolvedTxList',
  get({ get }) {
    const txMap = get(txMapState)
    return Object.values(txMap)
      .filter((tx) => tx.status !== 'fulfilled')
      .reverse()
  },
})
