export const Breakpoint = {
  mobile: 0,
  tablet: 800,
  smLaptop: 1080,
  laptop: 1366,
  desktop: 1600,
} as const

export type Breakpoint = keyof typeof Breakpoint

export const ConnectorId = {
  Binance: 'bsc',
  CoinbaseWallet: 'coinbaseWallet',
  TrustWallet: 'trustWallet',
  MetaMask: 'metaMask',
  WalletConnect: 'walletConnect',
  Injected: 'injected',
} as const

export type ConnectorId = (typeof ConnectorId)[keyof typeof ConnectorId]

export const ModalType = {
  Approve: 'Approve',
  Claim: 'Claim',
  Connect: 'Connect',
  Cooldown: 'Cooldown',
  Exit: 'Exit',
  Join: 'Join',
  Revenue: 'Revenue',
  Stake: 'Stake',
  SwitchNetwork: 'SwitchNetwork',
  Unstake: 'Unstake',
} as const

export type ModalType = (typeof ModalType)[keyof typeof ModalType]

export const Network = {
  MAINNET: 1,
  GOERLI: 5,
  GÖRLI: 5,
} as const

export type Network = (typeof Network)[keyof typeof Network]

export const ToastType = {
  Approve: 'Approve',
  Claim: 'Claim',
  Cooldown: 'Cooldown',
  Exit: 'Exit',
  Harvest: 'Harvest',
  Join: 'Join',
  Stake: 'Stake',
  Unstake: 'Unstake',
} as const

export type ToastType = (typeof ToastType)[keyof typeof ToastType]

export const LiquidityFieldType = {
  ExitAmount: 'ExitAmount',
  LiquidityPercent: 'LiquidityPercent',
  TokenA: 'TokenA',
  TokenB: 'TokenB',
} as const

export type LiquidityFieldType =
  (typeof LiquidityFieldType)[keyof typeof LiquidityFieldType]
