import { Network } from '@balancer-labs/sdk'

export const networkChainId =
  process.env.NEXT_PUBLIC_CHAIN_ID != null
    ? (Number(process.env.NEXT_PUBLIC_CHAIN_ID) as Network)
    : Network.MAINNET
