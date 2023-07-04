import { isAndroid, isFirefox, isIOS, isMobile } from 'react-device-detect'

import config from 'config'
import { ConnectorId } from 'config/constants'
import { metaMaskConnector } from '../connectors'
import { getTrustWalletProvider } from '../connectors/trustWallet'

export const metamaskWalletConfig = {
  id: 'metamask',
  title: 'Metamask',
  installed:
    typeof window !== 'undefined' &&
    Boolean((window?.ethereum as WindowProvider)?.isMetaMask) &&
    metaMaskConnector.ready,
  connectorId: ConnectorId.MetaMask,
  deepLink: `https://metamask.app.link/dapp/${config.siteUrl}`,
  downloadLink:
    isMobile && isIOS
      ? 'https://apps.apple.com/us/app/metamask/id1438144202'
      : isMobile && isAndroid
      ? 'https://play.google.com/store/apps/details?id=io.metamask'
      : 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
}

export const coinbaseWalletConfig = {
  id: 'coinbase',
  title: 'Coinbase Wallet',
  connectorId: ConnectorId.CoinbaseWallet,
  downloadLink:
    isMobile && isIOS
      ? 'https://apps.apple.com/us/app/coinbase-wallet-nfts-crypto/id1278383455'
      : isMobile && isAndroid
      ? 'https://play.google.com/store/apps/details?id=org.toshi'
      : 'https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad',
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
  downloadLink:
    isMobile && isIOS
      ? 'https://apps.apple.com/us/app/binance-buy-bitcoin-crypto/id1436799971'
      : isMobile && isAndroid
      ? 'https://play.google.com/store/apps/details?id=com.binance.dev'
      : isFirefox
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
    isMobile && isIOS
      ? 'https://apps.apple.com/us/app/trust-crypto-bitcoin-wallet/id1288339409'
      : isMobile && isAndroid
      ? 'https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp'
      : 'https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph/related',
}
