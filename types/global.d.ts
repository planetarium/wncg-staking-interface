import { MetaMaskInpageProvider } from '@metamask/providers'

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider
    dataLayer?: Array<any>
    gtag?: any
  }
}
