import { useNetwork, useSwitchNetwork as useWagmiSwitchNetwork } from 'wagmi'

import { gaEvent } from 'lib/gtag'
import { convertChainIdToHex, networkChainId } from 'utils/network'

export function useSwitchNetwork() {
  const { chain } = useNetwork()
  const { switchNetwork: initSwitchNetwork } = useWagmiSwitchNetwork({
    chainId: networkChainId,
    throwForSwitchChainNotSupported: true,
  })

  function switchNetwork() {
    try {
      initSwitchNetwork?.(networkChainId)
    } catch {
      if (!window.ethereum) return
      window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: convertChainIdToHex(networkChainId) }],
      })
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
