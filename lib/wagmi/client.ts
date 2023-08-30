import { createConfig } from 'wagmi'

import { publicClient, webSocketPublicClient } from './chains'
import {
  bscConnector,
  coinbaseConnector,
  injectedConnector,
  metaMaskConnector,
  trustWalletConnector,
  walletConnectConnector,
} from './connectors'

export default createConfig({
  autoConnect: false,
  publicClient,
  logger: {
    warn: null,
  },
  connectors: [
    metaMaskConnector,
    coinbaseConnector,
    walletConnectConnector,
    trustWalletConnector,
    bscConnector,
    injectedConnector,
  ],
  webSocketPublicClient,
})
