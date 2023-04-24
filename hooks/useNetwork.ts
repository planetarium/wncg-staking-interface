import { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import { useNetwork as _useNetwork } from 'wagmi'

import { currentChainAtom } from 'states/system'

export function useNetwork() {
  const { chain: _chain = null } = _useNetwork()

  const setChain = useSetAtom(currentChainAtom)

  function updateNetwork() {
    setChain(_chain)
  }

  useEffect(updateNetwork, [_chain, setChain])
}
