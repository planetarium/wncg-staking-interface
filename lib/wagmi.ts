import { configureChains, createClient, defaultChains } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import { configService } from 'services/config'

const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  infuraProvider({ apiKey: configService.apiKeys.infura }),
  publicProvider(),
])

const options = {
  appName: 'WNCG Staking',
  infuraId: configService.apiKeys.infura,
  qrcode: true,
}

export const metamaskConnector = new MetaMaskConnector({
  chains,
})

export const coinbaseConnector = new CoinbaseWalletConnector({
  chains,
  options,
})

export const walletConnectConnector = new WalletConnectConnector({
  chains,
  options,
})

export const connectors = [
  metamaskConnector,
  coinbaseConnector,
  walletConnectConnector,
]

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
})

export default client
