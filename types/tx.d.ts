type TxStatus = 'pending' | 'fulfilled' | 'error' | 'canceled'

type Tx = {
  addedTime: number
  data: string
  hash: string
  status: TxStatus
  toast: ToastContent
  transaction: Transaction
  error?: any
  finalizedTime?: number
}

type TxMap = {
  [id: string]: Tx
}

type TxError = {
  title: string
  message: string
}

type ApproveNextAction = {
  type: ModalType
  props?: any
}

type ApproveTx = {
  spender?: Hash
  spenderName?: string
  hash?: Hash
  desc?: string
  buttonLabel?: string
  toastLabel?: string
  titleSuffix?: string
  tokenAddress?: Hash
  tokenName?: string
  tokenSymbol?: string
  tokenDecimals?: number
  completeMessage?: string
  nextAction?: ApproveNextAction
}

type ClaimTx = {
  hash?: Hash
  earnedTokenRewards?: string[]
  rewardList?: boolean[]
  totalClaimFiatValue?: string
}

type CooldownTx = {
  hash?: Hash
}

type StakeTx = {
  hash?: Hash
  stakeAmount?: string
  stakedTokenBalance?: string
}

type UnstakeTx = {
  hash?: Hash
  earnedTokenRewards?: string[]
  unstakeAmount?: string
  stakedTokenBalance?: string
  totalClaimFiatValue?: string
}

type JoinTx = {
  hash?: Hash
  assets?: Hash[]
  joinAmounts?: `${number}`[]
  lpBalance?: string
  totalJoinFiatValue?: string
}

type AddLiquidityTx = {
  hash?: Hash
  assets?: Hash[]
  amountsIn?: string[]
  userLpAmount?: string
  amountsInFiatValueSum?: string
}

type ExitTx = {
  amountIn: string
  isNative: boolean
  hash?: Hash
}

type RemoveLiquidityTx = {
  assets?: Hash[]
  hash?: Hash
  amountsOut?: string[]
  amountsOutFiatValueSum?: string
  isNative?: boolean
  pcntOut?: string
  lpAmountOut?: string
}

type HarvestTx = {
  hash?: Hash
}
