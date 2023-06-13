import { createClient } from 'wagmi'

import { provider, webSocketProvider } from './chains'
import {
  // bscConnector,
  coinbaseConnector,
  injectedConnector,
  metaMaskConnector,
  trustWalletConnector,
  walletConnectConnector,
} from './connectors'

export default createClient({
  autoConnect: false,
  provider,
  logger: {
    warn: null,
  },
  connectors: [
    metaMaskConnector,
    coinbaseConnector,
    walletConnectConnector,
    trustWalletConnector,
    // bscConnector,
    injectedConnector,
  ],
  webSocketProvider,
})
