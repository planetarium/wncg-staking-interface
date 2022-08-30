import { TransactionAction } from 'services/transaction'
import { assertUnreachable } from './assertion'
import { bnum } from './num'

export function renderTxTitle(action: TransactionAction) {
  switch (action) {
    case TransactionAction.Approve:
      return 'Approve'
    case TransactionAction.ClaimAllRewards:
      return 'Claim all rewards'
    case TransactionAction.ClaimBalRewards:
    case TransactionAction.ClaimWncgRewards:
      return 'Claim reward'
    case TransactionAction.EarmarkRewards:
      return 'Harvest'
    case TransactionAction.ExitPool:
      return 'Exit pool'
    case TransactionAction.JoinPool:
      return 'Join pool'
    case TransactionAction.Stake:
      return 'Stake'
    case TransactionAction.StartCooldown:
      return 'Cooldown'
    case TransactionAction.Withdraw:
      return 'Withdraw'
    default:
      assertUnreachable(action)
  }
}

type TxMessageData = {
  symbol: string
  value?: string
}

export function renderTxSuccessMessage(
  action: TransactionAction,
  { symbol }: TxMessageData
) {
  switch (action) {
    case TransactionAction.Approve:
      return `Successfully approved ${symbol}`
    case TransactionAction.ClaimAllRewards:
      return 'Successfully claimed WNCG & BAL rewards'
    case TransactionAction.ClaimBalRewards:
      return 'Successfully claimed BAL reward'
    case TransactionAction.ClaimWncgRewards:
      return 'Successfully claimed WNCG reward'
    case TransactionAction.EarmarkRewards:
      return 'Successfully harvested BAL reward'
    case TransactionAction.ExitPool:
      return 'Successfully exited pool'
    case TransactionAction.JoinPool:
      return 'Successfully joined pool'
    case TransactionAction.Stake:
      return 'Successfully staked 20WETH-80WNCG'
    case TransactionAction.StartCooldown:
      return 'Successfully started cooldown'
    case TransactionAction.Withdraw:
      return 'Successfully withdrew staked 20WETH-80WNCG'
    case TransactionAction.WithdrawAndClaim:
      return 'Successfully withdrew and claimed'
    default:
      assertUnreachable(action)
  }
}

export function renderTxInfoMessage(
  action: TransactionAction,
  { symbol, value = '' }: TxMessageData
) {
  switch (action) {
    case TransactionAction.Approve:
      return `Approving ${symbol}`
    case TransactionAction.ClaimAllRewards:
      return 'Claim WNCG & BAL rewards'
    case TransactionAction.ClaimBalRewards:
      return 'Claim BAL reward'
    case TransactionAction.ClaimWncgRewards:
      return 'Claim WNCG reward'
    case TransactionAction.EarmarkRewards:
      return 'Harvest BAL reward'
    case TransactionAction.ExitPool:
      return 'Exiting the pool'
    case TransactionAction.JoinPool:
      return 'Joining the pool'
    case TransactionAction.Stake:
      return `Stake ${bnum(value).toFixed(8)} 20WETH-80WNCG`
    case TransactionAction.StartCooldown:
      return 'Start cooldown'
    case TransactionAction.Withdraw:
    case TransactionAction.WithdrawAndClaim:
      return `Withdraw ${bnum(value).toFixed(8)} 20WETH-80WNCG`
    default:
      assertUnreachable(action)
  }
}

export function renderTxErrorMessage(
  action: TransactionAction,
  { symbol }: TxMessageData
) {
  switch (action) {
    case TransactionAction.Approve:
      return `Failed to approve ${symbol}`
    case TransactionAction.ClaimAllRewards:
      return 'Failed to claim WNCG & BAL rewards'
    case TransactionAction.ClaimBalRewards:
      return 'Failed to claim BAL reward'
    case TransactionAction.ClaimWncgRewards:
      return 'Failed to claim WNCG reward'
    case TransactionAction.EarmarkRewards:
      return 'Failed to harvest BAL reward'
    case TransactionAction.ExitPool:
      return 'Failed to exit pool'
    case TransactionAction.JoinPool:
      return 'Failed to join pool'
    case TransactionAction.Stake:
      return 'Failed to stake 20WETH-80WNCG'
    case TransactionAction.StartCooldown:
      return 'Failed to start cooldown'
    case TransactionAction.Withdraw:
      return 'Failed to withdraw staked 20WETH-80WNCG'
    case TransactionAction.WithdrawAndClaim:
      return 'Failed to withdraw and claim'
    default:
      assertUnreachable(action)
  }
}

export function renderTxMessage(
  action: TransactionAction,
  type: ToastType,
  data: TxMessageData
) {
  switch (type) {
    case 'success':
      return renderTxSuccessMessage(action, data)
    case 'info':
      return renderTxInfoMessage(action, data)
    case 'error':
      return renderTxErrorMessage(action, data)
    default:
      assertUnreachable(type)
  }
}
