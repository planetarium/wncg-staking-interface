import { createConfig } from 'wagmi'

import { connectors } from 'lib/rainbowkit/connector'
import { publicClient, webSocketPublicClient } from './chains'

export default createConfig({
  autoConnect: false,
  publicClient,
  logger: {
    warn: null,
  },
  connectors,
  webSocketPublicClient,
})
