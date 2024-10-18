import binanceWallet from '@binance/w3w-rainbow-connector'
import {
  coinbaseWallet,
  metaMaskWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import config from 'config'
import { chains } from 'lib/wagmi/chains'

const walletConfig = {
  appName: config.appName,
  projectId: config.walletConnectProjectId ?? '#',
  chains,
}

export const wallets = [
  metaMaskWallet(walletConfig),
  coinbaseWallet(walletConfig),
  walletConnectWallet(walletConfig),
  trustWallet(walletConfig),
  binanceWallet(walletConfig),
]
