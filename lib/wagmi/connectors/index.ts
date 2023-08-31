import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { InjectedConnector } from 'wagmi/connectors/injected'

import config from 'config'
import { chains } from '../chains'
import { BinanceWalletConnector } from './binanceWallet'
import { TrustWalletConnector } from './trustWallet'

export const injectedConnector = new InjectedConnector({
  chains,
  options: {
    shimDisconnect: false,
  },
})

export const coinbaseConnector = new CoinbaseWalletConnector({
  chains,
  options: {
    appName: config.appName,
  },
})

export const walletConnectConnector = new WalletConnectConnector({
  chains,
  options: {
    projectId: config.walletConnectProjectId ?? '#',
    metadata: {
      name: config.appName,
      description: config.appDescription,
      url: config.baseUrl,
      icons: ['https://wagmi.sh/icon.png'], // FIXME: 아이콘 교체
    },
  },
})

export const metaMaskConnector = new MetaMaskConnector({
  chains,
  options: {
    shimDisconnect: false,
    UNSTABLE_shimOnConnectSelectAccount: true,
  },
})

export const bscConnector = new BinanceWalletConnector({ chains })

export const trustWalletConnector = new TrustWalletConnector({
  chains,
  options: {
    shimDisconnect: false,
    shimChainChangedDisconnect: true,
  },
})
