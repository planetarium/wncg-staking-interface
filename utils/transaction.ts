import { TransactionAction } from 'app/states/transaction'
import { assertUnreachable } from './assertion'

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
