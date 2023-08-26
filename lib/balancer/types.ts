import { BalancerSDK, PoolWithMethods } from '@balancer-labs/sdk'

export type JoinParams = {
  assets: Hash[]
  amountsIn: string[]
  account: Hash
  slippageBsp: string
  // relayerSignature?: string
  //   approvalActions: TransactionActionInfo[]
  // transactionDeadline: number
}

export type JoinQueryOutput = {
  bptOut: string
  priceImpact: string
  joinRes: any
}

export abstract class JoinPoolHandler {
  constructor(
    public readonly poolId: string,
    public readonly sdk: BalancerSDK
  ) {}

  abstract join(params: JoinParams): void

  abstract queryJoin(params: JoinParams): Promise<JoinQueryOutput>
}

export type ExactInJoinResponse = ReturnType<PoolWithMethods['buildJoin']>

export abstract class PropJoinCalculator {
  constructor(
    public readonly chainId: ChainId,
    public readonly poolTokens: PoolToken[],
    public readonly tokens: TokenMap,
    public readonly isNative: boolean,
    public readonly maxSafeBalances: string[]
  ) {}

  abstract calcPropAmountsIn(amountIn: string, fixedToken: TokenInfo): string[]
}
