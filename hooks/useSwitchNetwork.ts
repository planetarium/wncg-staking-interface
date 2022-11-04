import { useSwitchNetwork as useWagmiSwitchNetwork } from 'wagmi'

import { gaEvent } from 'lib/gtag'
import { networkChainId } from 'utils/network'
import { useConnectWallets } from './useConnectWallets'
import { useNetwork } from './useNetwork'

export function useSwitchNetwork() {
  const { connect } = useConnectWallets()
  const { chain } = useNetwork()

  const { switchNetwork: initSwitchNetwork } = useWagmiSwitchNetwork({
    chainId: networkChainId,
    throwForSwitchChainNotSupported: true,
  })

  function switchNetwork() {
    try {
      initSwitchNetwork?.(networkChainId)
    } catch {
      // TODO: Discuss how to handle users w/o window.ethereum
      if (!window.ethereum) return
      connect()
    }

    gaEvent({
      name: 'switch_network',
      params: {
        oldNetwork: chain?.id,
      },
    })
  }

  return {
    switchNetwork,
  }
}
