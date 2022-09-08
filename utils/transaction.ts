import { TxAction } from 'services/transaction'
import { assertUnreachable } from './assertion'
import { bnum } from './num'

export function txToastTitle(action: TxAction, type?: ToastType) {
  let title: string

  switch (action) {
    case TxAction.Approve:
      title = 'Approve'
      break
    case TxAction.ClaimAll:
    case TxAction.ClaimBal:
    case TxAction.ClaimWncg:
      title = 'Claim Rewards'
      break
    case TxAction.EarmarkRewards:
      title = 'Harvest'
      break
    case TxAction.ExitPool:
      title = 'Exit Pool'
      break
    case TxAction.JoinPool:
      title = 'Join Pool'
      break
    case TxAction.Stake:
      title = 'Stake'
      break
    case TxAction.Cooldown:
      title = 'Cooldown'
      break
    case TxAction.Withdraw:
      title = 'Withdraw'
      break
    case TxAction.WithdrawAndClaim:
      title = 'Withdraw & Claim'
      break
    default:
      assertUnreachable(action)
  }

  if (type === 'error') return `Failed: ${title}`
  if (type === 'success') return `Success: ${title}`
  return title
}

export function txSuccessMessage(action: TxAction, params?: string | string[]) {
  switch (action) {
    case TxAction.Approve:
      return `Successfully approved **${parseTxActionParams(params)}**`
    case TxAction.ClaimAll:
      return `Successfully claimed **${parseTxActionParams(
        params
      )} & BAL** rewards`
    case TxAction.ClaimBal:
      return 'Successfully claimed **BAL** reward'
    case TxAction.ClaimWncg:
      return `Successfully claimed **${parseTxActionParams(params)}** reward`
    case TxAction.EarmarkRewards:
      return 'Successfully harvested **BAL** reward'
    case TxAction.ExitPool:
      return `Successfully exited ${parseTxActionParams(params)} pool`
    case TxAction.JoinPool:
      return `Successfully joined ${parseTxActionParams(params)} pool`
    case TxAction.Stake:
      return `Successfully staked ${parseTxActionParams(params)}`
    case TxAction.Cooldown:
      return 'Successfully started cooldown'
    case TxAction.Withdraw:
      return `Successfully withdrew staked ${parseTxActionParams(params)}`
    case TxAction.WithdrawAndClaim:
      return 'Successfully withdrew and claimed all rewards'
    default:
      assertUnreachable(action)
  }
}

export function txInfoMessage(action: TxAction, params?: string | string[]) {
  switch (action) {
    case TxAction.Approve:
      return `Approving **${parseTxActionParams(params)}**`
    case TxAction.ClaimAll:
      return `Claim **${parseTxActionParams(params)} & BAL** rewards`
    case TxAction.ClaimBal:
      return 'Claim **BAL** reward'
    case TxAction.ClaimWncg:
      return `Claim **${parseTxActionParams(params)}** reward`
    case TxAction.EarmarkRewards:
      return 'Harvest BAL reward'
    case TxAction.ExitPool:
      return `Exiting **${parseTxActionParams(params)}** pool`
    case TxAction.JoinPool:
      return `Joining **${parseTxActionParams(params)}** pool`
    case TxAction.Stake:
      return `Stake ${parseTxActionParams(params)}`
    case TxAction.Cooldown:
      return 'Start cooldown'
    case TxAction.Withdraw:
    case TxAction.WithdrawAndClaim:
      return `Withdraw ${parseTxActionParams(params)}`
    default:
      assertUnreachable(action)
  }
}

export function isClaimAction(action: TxAction) {
  return (
    [TxAction.ClaimAll, TxAction.ClaimBal, TxAction.ClaimWncg] as TxAction[]
  ).includes(action)
}

export function parseMarkdown(value: string) {
  const rawHtmlString = value
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>') // NOTE: bold
    .replace(/\*(.*)\*/gim, '<em>$1</em>') // NOTE: italic
    .replace(/\n$/gim, '<br />')
  return rawHtmlString.trim()
}

function parseTxActionParams(params?: string | string[]) {
  if (!params || typeof params === 'string') return params
  return `**${bnum(params[0] || 0).toFixed(8)}** ${params?.[1]}`
}
