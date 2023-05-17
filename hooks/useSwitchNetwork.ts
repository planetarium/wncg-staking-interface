import { useSwitchNetwork as _useSwitchNetwork } from 'wagmi'

import { useConnect } from './useConnect'
import config from 'config'

export function useSwitchNetwork() {
  const { openConnectModal } = useConnect()

  const { switchNetwork: _switchNetwork } = _useSwitchNetwork({
    chainId: config.chainId,
    throwForSwitchChainNotSupported: false,
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
