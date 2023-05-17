import config from 'config'
import {
  binanceWalletConfig,
  coinbaseWalletConfig,
  metamaskWalletConfig,
  trustWalletConfig,
  walletConnectWalletConfig,
} from './config'

type WalletParams = {
  chainId: number
  connect: ConnectFn
}

const walletConfigs = (_: WalletParams): WalletConfig[] => {
  return [
    metamaskWalletConfig,
    coinbaseWalletConfig,
    walletConnectWalletConfig,
    trustWalletConfig,
    // binanceWalletConfig,
  ]
}

export function createWallets({
  chainId = config.chainId,
  connect,
}: WalletParams) {
  return walletConfigs({
    chainId,
    connect,
  })
}
