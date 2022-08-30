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
      return 'Claim BAL reward'
    case TransactionAction.ClaimWncgRewards:
      return 'Claim WNCG reward'
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
    case TransactionAction.WithdrawAndClaim:
      return 'Withdraw & claim'
    default:
      assertUnreachable(action)
  }
}

export function renderTxSuccessMessage(
  action: TransactionAction,
  params?: string | string[]
) {
  switch (action) {
    case TransactionAction.Approve:
      return `Successfully approved ${parseParams(params)}`
    case TransactionAction.ClaimAllRewards:
      return `Successfully claimed ${parseParams(params)} & BAL rewards`
    case TransactionAction.ClaimBalRewards:
      return 'Successfully claimed BAL reward'
    case TransactionAction.ClaimWncgRewards:
      return `Successfully claimed ${parseParams(params)} reward`
    case TransactionAction.EarmarkRewards:
      return 'Successfully harvested BAL reward'
    case TransactionAction.ExitPool:
      return `Successfully exited ${parseParams(params)} pool`
    case TransactionAction.JoinPool:
      return `Successfully joined ${parseParams(params)} pool`
    case TransactionAction.Stake:
      return `Successfully staked ${parseParams(params)}`
    case TransactionAction.StartCooldown:
      return 'Successfully started cooldown'
    case TransactionAction.Withdraw:
      return `Successfully withdrew staked ${parseParams(params)}`
    case TransactionAction.WithdrawAndClaim:
      return 'Successfully withdrew and claimed all rewards'
    default:
      assertUnreachable(action)
  }
}

export function renderTxInfoMessage(
  action: TransactionAction,
  params?: string | string[]
) {
  switch (action) {
    case TransactionAction.Approve:
      return `Approving ${parseParams(params)}`
    case TransactionAction.ClaimAllRewards:
      return `Claim ${parseParams(params)} & BAL rewards`
    case TransactionAction.ClaimBalRewards:
      return 'Claim BAL reward'
    case TransactionAction.ClaimWncgRewards:
      return `Claim ${parseParams(params)} reward`
    case TransactionAction.EarmarkRewards:
      return 'Harvest BAL reward'
    case TransactionAction.ExitPool:
      return `Exiting ${parseParams(params)} pool`
    case TransactionAction.JoinPool:
      return `Joining ${parseParams(params)} pool`
    case TransactionAction.Stake:
      return `Stake ${parseParams(params)}`
    case TransactionAction.StartCooldown:
      return 'Start cooldown'
    case TransactionAction.Withdraw:
    case TransactionAction.WithdrawAndClaim:
      return `Withdraw ${parseParams(params)}`
    default:
      assertUnreachable(action)
  }
}

export function renderTxErrorMessage(
  action: TransactionAction,
  params?: string | string[]
) {
  switch (action) {
    case TransactionAction.Approve:
      return `Failed to approve ${parseParams(params)}`
    case TransactionAction.ClaimAllRewards:
      return `Failed to claim ${parseParams(params)} & BAL rewards`
    case TransactionAction.ClaimBalRewards:
      return 'Failed to claim BAL reward'
    case TransactionAction.ClaimWncgRewards:
      return `Failed to claim ${parseParams(params)} reward`
    case TransactionAction.EarmarkRewards:
      return 'Failed to harvest BAL reward'
    case TransactionAction.ExitPool:
      return `Failed to exit ${parseParams(params)} pool`
    case TransactionAction.JoinPool:
      return `Failed to join ${parseParams(params)} pool`
    case TransactionAction.Stake:
      return `Failed to stake ${parseParams(params)}`
    case TransactionAction.StartCooldown:
      return 'Failed to start cooldown'
    case TransactionAction.Withdraw:
      return `Failed to withdraw staked ${parseParams(params)}`
    case TransactionAction.WithdrawAndClaim:
      return 'Failed to withdraw and claim'
    default:
      assertUnreachable(action)
  }
}

function parseParams(params?: string | string[]) {
  if (!params || typeof params === 'string') return params
  return `${bnum(params[0] || 0).toFixed(8)} ${params?.[1]}`
}
