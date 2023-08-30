import { BalancerSDK, PoolWithMethods } from '@balancer-labs/sdk'

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

export const ExitType = {
  GivenIn: 'GIVEN_IN',
  GivenOut: 'GIVEN_OUT',
} as const

export type ExitType = (typeof ExitType)[keyof typeof ExitType]

export type ExitParams = {
  assets: TokenInfo[]
  bptIn: string // user bpt
  amountsOut?: string[]
  // tokenInfo: TokenInfoMap
  account: Hash
  slippageBsp: string
  // relayerSignature?: string
  // bptInValid: boolean
  // approvalActions: TransactionActionInfo[]
  // transactionDeadline: number
  toInternalBalance?: boolean // false
}

export type ExitQueryOutput = {
  priceImpact: number
  amountsOut: string[]
  exitRes: any
  // Whether the transaction is ready to be sent.
  // In some cases queries may require approvals first before they can generate
  // the tx paylod. So in the UI we need a way to show a loading state until the tx is ready.
  // txReady: boolean
}

export abstract class ExitPoolHandler {
  constructor(
    public readonly poolId: string,
    public readonly poolTokens: PoolToken[],
    public readonly tokens: TokenMap,
    public readonly sdk: BalancerSDK
  ) {}

  abstract queryExit(params: ExitParams): Promise<ExitQueryOutput>
}

export type ExitExactInResponse = ReturnType<
  PoolWithMethods['buildExitExactBPTIn']
>

export type ExitExactOutResponse = ReturnType<
  PoolWithMethods['buildExitExactTokensOut']
>
