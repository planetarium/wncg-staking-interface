import { TxAction } from 'services/transaction'
import { assertUnreachable } from './assertion'
import { bnum } from './num'

export function txToastTitle(action: TxAction) {
  switch (action) {
    case TxAction.Approve:
      return 'Approve'
    case TxAction.ClaimAllRewards:
      return 'Claim all rewards'
    case TxAction.ClaimBalRewards:
      return 'Claim BAL reward'
    case TxAction.ClaimWncgRewards:
      return 'Claim WNCG reward'
    case TxAction.EarmarkRewards:
      return 'Harvest'
    case TxAction.ExitPool:
      return 'Exit pool'
    case TxAction.JoinPool:
      return 'Join pool'
    case TxAction.Stake:
      return 'Stake'
    case TxAction.StartCooldown:
      return 'Cooldown'
    case TxAction.Withdraw:
      return 'Withdraw'
    case TxAction.WithdrawAndClaim:
      return 'Withdraw & claim'
    default:
      assertUnreachable(action)
  }
}

export function txSuccessMessage(action: TxAction, params?: string | string[]) {
  switch (action) {
    case TxAction.Approve:
      return `Successfully approved ${parseParams(params)}`
    case TxAction.ClaimAllRewards:
      return `Successfully claimed ${parseParams(params)} & BAL rewards`
    case TxAction.ClaimBalRewards:
      return 'Successfully claimed BAL reward'
    case TxAction.ClaimWncgRewards:
      return `Successfully claimed ${parseParams(params)} reward`
    case TxAction.EarmarkRewards:
      return 'Successfully harvested BAL reward'
    case TxAction.ExitPool:
      return `Successfully exited ${parseParams(params)} pool`
    case TxAction.JoinPool:
      return `Successfully joined ${parseParams(params)} pool`
    case TxAction.Stake:
      return `Successfully staked ${parseParams(params)}`
    case TxAction.StartCooldown:
      return 'Successfully started cooldown'
    case TxAction.Withdraw:
      return `Successfully withdrew staked ${parseParams(params)}`
    case TxAction.WithdrawAndClaim:
      return 'Successfully withdrew and claimed all rewards'
    default:
      assertUnreachable(action)
  }
}

export function txInfoMessage(action: TxAction, params?: string | string[]) {
  switch (action) {
    case TxAction.Approve:
      return `Approving ${parseParams(params)}`
    case TxAction.ClaimAllRewards:
      return `Claim ${parseParams(params)} & BAL rewards`
    case TxAction.ClaimBalRewards:
      return 'Claim BAL reward'
    case TxAction.ClaimWncgRewards:
      return `Claim ${parseParams(params)} reward`
    case TxAction.EarmarkRewards:
      return 'Harvest BAL reward'
    case TxAction.ExitPool:
      return `Exiting ${parseParams(params)} pool`
    case TxAction.JoinPool:
      return `Joining ${parseParams(params)} pool`
    case TxAction.Stake:
      return `Stake ${parseParams(params)}`
    case TxAction.StartCooldown:
      return 'Start cooldown'
    case TxAction.Withdraw:
    case TxAction.WithdrawAndClaim:
      return `Withdraw ${parseParams(params)}`
    default:
      assertUnreachable(action)
  }
}

export function renderTxErrorMessage(
  action: TxAction,
  params?: string | string[]
) {
  switch (action) {
    case TxAction.Approve:
      return `Failed to approve ${parseParams(params)}`
    case TxAction.ClaimAllRewards:
      return `Failed to claim ${parseParams(params)} & BAL rewards`
    case TxAction.ClaimBalRewards:
      return 'Failed to claim BAL reward'
    case TxAction.ClaimWncgRewards:
      return `Failed to claim ${parseParams(params)} reward`
    case TxAction.EarmarkRewards:
      return 'Failed to harvest BAL reward'
    case TxAction.ExitPool:
      return `Failed to exit ${parseParams(params)} pool`
    case TxAction.JoinPool:
      return `Failed to join ${parseParams(params)} pool`
    case TxAction.Stake:
      return `Failed to stake ${parseParams(params)}`
    case TxAction.StartCooldown:
      return 'Failed to start cooldown'
    case TxAction.Withdraw:
      return `Failed to withdraw staked ${parseParams(params)}`
    case TxAction.WithdrawAndClaim:
      return 'Failed to withdraw and claim'
    default:
      assertUnreachable(action)
  }
}

function parseParams(params?: string | string[]) {
  if (!params || typeof params === 'string') return params
  return `${bnum(params[0] || 0).toFixed(8)} ${params?.[1]}`
}
