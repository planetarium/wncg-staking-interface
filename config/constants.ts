export const Breakpoint = {
  mobile: 0,
  tablet: 800,
  smLaptop: 1080,
  laptop: 1366,
  desktop: 1600,
} as const

export type Breakpoint = keyof typeof Breakpoint

export const ConnectorId = {
  Binance: 'binance',
  CoinbaseWallet: 'coinbase',
  TrustWallet: 'trust',
  MetaMask: 'metaMask',
  WalletConnect: 'walletConnect',
  // Injected: 'injected',
} as const

export type ConnectorId = (typeof ConnectorId)[keyof typeof ConnectorId]

export const ModalType = {
  Approve: 'Approve',
  AddLiquidity: 'AddLiquidity',
  Claim: 'Claim',
  Cooldown: 'Cooldown',
  Exit: 'Exit',
  Join: 'Join',
  Revenue: 'Revenue',
  RemoveLiquidity: 'RemoveLiquidity',
  Stake: 'Stake',
  SwitchNetwork: 'SwitchNetwork',
  Unstake: 'Unstake',
} as const

export type ModalType = (typeof ModalType)[keyof typeof ModalType]

export const ToastType = {
  AddLiquidity: 'AddLiquidity',
  Approve: 'Approve',
  Claim: 'Claim',
  Cooldown: 'Cooldown',
  Exit: 'Exit',
  Harvest: 'Harvest',
  RemoveLiquidity: 'RemoveLiquidity',
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
  UseNative: 'UseNative',
  HighPriceImpact: 'HighPriceImpact',
} as const

export type LiquidityFieldType =
  (typeof LiquidityFieldType)[keyof typeof LiquidityFieldType]

export const JoinPoolField = {
  TokenA: 'TokenA',
  TokenB: 'TokenB',
} as const

export type JoinPoolField = (typeof JoinPoolField)[keyof typeof JoinPoolField]

export const ExitPoolField = {
  UseNative: 'UseNative',
  LiquidityPercent: 'LiquidityPercent',
} as const

export type ExitPoolField = (typeof ExitPoolField)[keyof typeof ExitPoolField]

export const AddLiquidityField = {
  TokenA: 'TokenA',
  TokenB: 'TokenB',
  UseNative: 'UseNative',
} as const

export type AddLiquidityField =
  (typeof AddLiquidityField)[keyof typeof AddLiquidityField]

export const RemoveLiquidityField = {
  Percent: 'Percent',
  UseNative: 'UseNative',
  Signature: 'Signature',
} as const

export type RemoveLiquidityField =
  (typeof RemoveLiquidityField)[keyof typeof RemoveLiquidityField]

export type DexPlatform = 'balancer' | 'pancakeSwap'
