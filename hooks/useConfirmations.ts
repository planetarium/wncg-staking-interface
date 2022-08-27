import store from 'store'

import { STORE_CONFIRMATIONS_KEY } from 'constants/storeKeys'

const DAY_IN_SECONDS = 60 * 60 * 24

type Confirmation = {
  status: 'pending' | 'fulfilled'
  addedTime: number
  finalizedTime?: number
  data?: any
}

export function useConfirmations() {
  function getConfirmations(hash: string) {
    const current = store.get(STORE_CONFIRMATIONS_KEY) || {}
    return current[key(hash)]?.status || false
  }

  function getHashData(hash: string) {
    const current = store.get(STORE_CONFIRMATIONS_KEY) || {}
    return current[key(hash)]?.data || {}
  }

  function setConfirmations(hash: string) {
    const current = store.get(STORE_CONFIRMATIONS_KEY) || {}
    const target = current[key(hash)]
    if (!target) return
    const newConfirmations = {
      ...current,
      [key(hash)]: {
        ...target,
        status: 'fulfilled',
        finalizedTime: Date.now(),
      },
    }
    store.set(STORE_CONFIRMATIONS_KEY, newConfirmations)
  }

  function registerConfirmations(hash: string, data?: any) {
    const current = store.get(STORE_CONFIRMATIONS_KEY) || {}
    const newConfirmations = {
      ...current,
      [key(hash)]: {
        status: 'pending',
        addedTime: Date.now(),
        data,
      },
    }
    store.set(STORE_CONFIRMATIONS_KEY, newConfirmations)
  }

  function resetConfirmations() {
    store.remove(STORE_CONFIRMATIONS_KEY)
  }

  function flushOutdatedConfirmations() {
    const current: Record<string, Confirmation> =
      store.get(STORE_CONFIRMATIONS_KEY) || {}
    const now = Date.now()

    const newConfirmations: Record<string, Confirmation> = {}
    Object.entries(current).forEach(([hash, value]) => {
      if (
        value.finalizedTime &&
        now - value.finalizedTime > DAY_IN_SECONDS * 1_000
      ) {
        return
      }
      newConfirmations[hash] = value
    })

    store.set(STORE_CONFIRMATIONS_KEY, newConfirmations)
  }

  return {
    flushOutdatedConfirmations,
    getConfirmations,
    getHashData,
    setConfirmations,
    registerConfirmations,
    resetConfirmations,
  }
}

function key(hash: string) {
  return `tx_${hash}`
}
