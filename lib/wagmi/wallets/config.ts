import { isFirefox } from 'react-device-detect'

import config from 'config'
import { ConnectorId } from 'config/constants'
import { metaMaskConnector } from '../connectors'
import { getTrustWalletProvider } from '../connectors/trustWallet'

export const metamaskWalletConfig = {
  id: 'metamask',
  title: 'Metamask',
  installed:
    typeof window !== 'undefined' &&
    Boolean(window.ethereum?.isMetaMask) &&
    metaMaskConnector.ready,
  connectorId: ConnectorId.MetaMask,

  deepLink: `https://metamask.app.link/dapp/${config.siteUrl}`,
  downloadLink:
    'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
}

export const coinbaseWalletConfig = {
  id: 'coinbase',
  title: 'Coinbase Wallet',
  connectorId: ConnectorId.CoinbaseWallet,
}

export const walletConnectWalletConfig = {
  id: 'walletconnect',
  title: 'WalletConnect',
  connectorId: ConnectorId.WalletConnect,
}

export const binanceWalletConfig = {
  id: 'binance',
  title: 'Binance Wallet',
  installed:
    typeof window !== 'undefined' && Boolean((window as any).BinanceChain),
  connectorId: ConnectorId.Binance,
  guide: {
    desktop: 'https://www.bnbchain.org/en/binance-wallet',
  },
  downloadLink: isFirefox
    ? 'https://addons.mozilla.org/en-US/firefox/addon/binance-chain/?src=search'
    : 'https://chrome.google.com/webstore/detail/binance-wallet/fhbohimaelbohpjbbldcngcnapndodjp',
}

export const trustWalletConfig = {
  id: 'trustWallet',
  title: 'Trust Wallet',
  connectorId: ConnectorId.TrustWallet,
  installed: !!getTrustWalletProvider(),
  deepLink: `https://link.trustwallet.com/open_url?coin_id=637&url=${config.siteUrl}`,
  downloadLink:
    'https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph/related',
}
