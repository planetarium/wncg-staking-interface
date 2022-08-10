export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

export const IS_ETHEREUM =
  Number(process.env.NEXT_PUBLIC_MAINNET_CHAIN_ID) === 1

export const CURRENT_MAINNET = IS_ETHEREUM ? 1 : 42

export const BPT_POOL_ID = IS_ETHEREUM
  ? process.env.NEXT_PUBLIC_BPT_POOL_ID_MAINNET
  : process.env.NEXT_PUBLIC_BPT_POOL_ID_KOVAN

export const BALANCER_POOL_URL = IS_ETHEREUM
  ? process.env.NEXT_PUBLIC_BALANCER_POOL_URL_MAINNET
  : process.env.NEXT_PUBLIC_BALANCER_POOL_URL_KOVAN

export const BALANCER_SUBGRAPHS = IS_ETHEREUM
  ? process.env.NEXT_PUBLIC_BALANCER_SUBGRAPHS_MAINNET
  : process.env.NEXT_PUBLIC_BALANCER_SUBGRAPHS_KOVAN

export const stakingContractAddress = process.env
  .NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS as string

export const vaultContractAddress = process.env
  .NEXT_PUBLIC_BALANCER_VAULT_ADDRESS as string
