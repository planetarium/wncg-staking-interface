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
    binanceWalletConfig,
  ]
}

export function createWallets({ chainId, connect }: WalletParams) {
  return walletConfigs({
    chainId,
    connect,
  })
}
