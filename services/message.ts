import { Transaction } from 'ethers'
import type { Web3Provider } from '@ethersproject/providers'
import { Interface, Result } from '@ethersproject/abi'

import { POOL_DECIMALS } from 'constants/tokens'
import {
  BalancerVaultAbi,
  Erc20Abi,
  LiquidityGaugeAbi,
  StakingAbi,
} from 'config/abi'
import { assertUnreachable } from 'utils/assertUnreachable'
import { getTokenSymbol } from 'utils/token'
import { formatUnits } from 'utils/formatUnits'

const vaultIface = new Interface(BalancerVaultAbi)
const ercTokenIface = new Interface(Erc20Abi)
const liquidityGaugeIface = new Interface(LiquidityGaugeAbi)
const stakingIface = new Interface(StakingAbi)

export class MessageService {
  constructor(public readonly provider: Web3Provider) {}

  private approveMessages(symbol?: string): ToastMessages {
    const token = symbol || `the requested token`
    return {
      success: `Successfully approved ${token}`,
      error: `Failed to approve ${token}`,
      info: `Approving ${token}`,
    }
  }

  private claimMessages(token?: string): ToastMessages {
    const params = token ? `${token} reward` : 'all rewards'

    return {
      success: `Successfully claimed ${params}`,
      error: `Failed to claim ${params}`,
      info: `Claim ${params}`,
    }
  }

  private earmarkMessages(): ToastMessages {
    return {
      success: `Successfully harvested BAL reward`,
      error: `Failed to harvest BAL reward`,
      info: `Harvest BAL reward`,
    }
  }

  private stakeMessages(args: Result): ToastMessages {
    const [_amount] = args
    const amount = formatUnits(_amount, POOL_DECIMALS)

    return {
      success: `Successfully staked ${amount}`,
      error: `Failed to stake ${amount}`,
      info: `Stake ${amount}`,
    }
  }

  private cooldownMessages(): ToastMessages {
    return {
      success: `Successfully started cooldown`,
      error: `Failed to start cooldown`,
      info: `Start Cooldown`,
    }
  }

  private withdrawMessages(args: Result): ToastMessages {
    const [_amount, isClaimAll] = args
    const amount = formatUnits(_amount, POOL_DECIMALS)

    if (isClaimAll) {
      return {
        success: `Successfully withdrew staked ${amount} and claimed all rewards`,
        error: `Failed to withdraw ${amount} & claim rewards`,
        info: `Withdraw ${amount} and claim all rewards`,
      }
    }
    return {
      success: `Successfully withdrew staked ${amount}`,
      error: `Failed to withdraw ${amount}`,
      info: `Withdraw ${amount}`,
    }
  }

  private joinMessages(): ToastMessages {
    return {
      success: `Successfully joined the pool`,
      error: `Failed to join the pool`,
      info: `Joining pool`,
    }
  }

  private exitMessages(): ToastMessages {
    return {
      success: `Successfully exited the pool`,
      error: `Failed to exit the pool`,
      info: `Exiting pool`,
    }
  }

  private parsedTx = (data: string) => {
    let result
    const arg = { data }

    try {
      result = stakingIface.parseTransaction(arg)
    } catch {
      try {
        result = vaultIface.parseTransaction(arg)
      } catch {
        try {
          result = ercTokenIface.parseTransaction(arg)
        } catch {
          try {
            result = liquidityGaugeIface.parseTransaction(arg)
          } catch (error) {
            throw error
          }
        }
      }
    }

    return result
  }

  toastMessages = ({ data, to }: Transaction) => {
    const parsed = this.parsedTx(data)
    const { name = '', args = [] } = parsed ?? {}

    switch (name) {
      case 'approve':
        const symbol = getTokenSymbol(to ?? '')
        return this.approveMessages(symbol)
      case 'stake':
        return this.stakeMessages(args as any)
      case 'cooldown':
        return this.cooldownMessages()
      case 'withdraw':
        return this.withdrawMessages(args as any)
      case 'claimBALRewards':
        return this.claimMessages('BAL')
      case 'claimWNCGRewards':
        return this.claimMessages('wNCG')
      case 'claimAllRewards':
        return this.claimMessages()
      case 'earmarkRewards':
        return this.earmarkMessages()
      case 'joinPool':
        return this.joinMessages()
      case 'exitPool':
        return this.exitMessages()
      default:
        assertUnreachable(name)
    }
  }

  toastTitles = ({ data, to }: Transaction) => {
    const parsed = this.parsedTx(data)
    const { name, args = [] } = parsed ?? {}

    switch (name) {
      case 'approve':
        const symbol = getTokenSymbol(to ?? '')
        return `Approve ${symbol}`
      case 'stake':
        return 'Stake'
      case 'cooldown':
        return 'Start Cooldown'
      case 'withdraw':
        return args[1] ? 'Withdraw & Claim' : 'Withdraw'
      case 'claimBALRewards':
        return 'Claim BAL Rewards'
      case 'claimWNCGRewards':
        return 'Claim wNCG Rewards'
      case 'claimAllRewards':
        return 'Claim All Rewards'
      case 'earmarkRewards':
        return 'Harvest BAL Rewards'
      case 'joinPool':
        return 'Join Pool'
      case 'exitPool':
        return 'Exit Pool'
      default:
        assertUnreachable(name)
    }
  }
}
