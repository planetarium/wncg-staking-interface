import { useSwitchNetwork as _useSwitchNetwork } from 'wagmi'

import { isEthereum } from 'utils/isEthereum'
import { useConnect } from './useConnect'
import { useChain } from './useChain'
import { useRefetch } from './useRefetch'

type UseSwitchNetworkOptions = {
  onSuccess?(): void
  onError?(): void
}

export function useSwitchNetwork() {
  const { chainId } = useChain()
  const { openConnectModal } = useConnect()

  const refetch = useRefetch({
    userAllowances: true,
    userBalances: true,
    userData: true,
    staking: true,
    pool: true,
    poolSnapshot: isEthereum(chainId),
    prices: true,
  })

  const { switchNetwork: _switchNetwork } = _useSwitchNetwork({
    chainId,
    throwForSwitchChainNotSupported: false,
    onSuccess() {
      refetch()
    },
  })

  function switchNetwork() {
    try {
      _switchNetwork?.()
    } catch (error: any) {
      if (!window.ethereum) return
      openConnectModal()
    }
  }

  function switchBeforeSend(error: any) {
    if (error.name === 'ChainMismatchError' || error.code === 'NETWORK_ERROR') {
      try {
        switchNetwork()
      } catch (error: any) {}
    }
  }

  return {
    switchNetwork,
    switchBeforeSend,
  }
}
