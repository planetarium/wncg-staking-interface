declare global {
  interface Window {
    ethereum?: import('wagmi').WindowProvider
    dataLayer?: Array<any>
  }
}
