import store from 'store'

const STORE_CONFIRMATIONS_KEY = `wncgStaking.confirmations`
const DAY_IN_SECONDS = 60 * 60 * 24

type Confirmation = {
  status: 'pending' | 'fulfilled'
  addedTime: number
  finalizedTime?: number
}

export function useConfirmations() {
  function getConfirmations(hash: string) {
    const current = store.get(STORE_CONFIRMATIONS_KEY) || {}
    return current[key(hash)]?.status || false
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

  function registerConfirmations(hash: string) {
    const current = store.get(STORE_CONFIRMATIONS_KEY) || {}
    const newConfirmations = {
      ...current,
      [key(hash)]: {
        status: 'pending',
        addedTime: Date.now(),
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
    setConfirmations,
    registerConfirmations,
    resetConfirmations,
  }
}

function key(hash: string) {
  return `tx_${hash}`
}
