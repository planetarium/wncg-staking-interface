import { useCallback } from 'react'

import { getAccount } from 'app/states/connection'
import { addTx, TransactionAction } from 'app/states/transaction'
import {
  resetCooldownEndsAt,
  resetWithdrawEndsAt,
  setCooldownEndsAt,
  setWithdrawEndsAt,
  setUnstakePeriod,
} from 'app/states/unstake'
import Decimal, { etherToWei, sanitizeNumber } from 'utils/num'
import { useContract } from './useContract'
import { useError } from './useError'
import { useAppDispatch, useAppSelector } from './useRedux'
import { useToast } from './useToast'

export function useUnstake() {
  const contract = useContract()
  const { handleError } = useError()
  const { addToast } = useToast()

  const dispatch = useAppDispatch()
  const account = useAppSelector(getAccount)

  const startCooldown = useCallback(async () => {
    const data = await contract?.cooldown()
    if (data) {
      const tx = {
        hash: data.hash,
        action: TransactionAction.StartCooldown,
        summary: 'Start cooldown',
      }
      dispatch(addTx(tx))
      addToast(tx, data.hash)
    }
  }, [addToast, contract, dispatch])

  const withdraw = useCallback(
    async (amount: string) => {
      const data = await contract?.withdraw(
        etherToWei(sanitizeNumber(amount)),
        false
      )
      if (data) {
        const tx = {
          hash: data.hash,
          action: TransactionAction.Withdraw,
          summary: `Withdraw ${new Decimal(amount).toFixed(8)} 20WETH-80WNCG`,
        }
        dispatch(addTx(tx))
        addToast(tx, data.hash)
      }
    },
    [addToast, contract, dispatch]
  )

  const withdrawAndClaim = useCallback(
    async (amount: string) => {
      const data = await contract?.withdraw(
        etherToWei(sanitizeNumber(amount)),
        true
      )
      if (data) {
        const tx = {
          hash: data.hash,
          action: TransactionAction.Withdraw,
          summary: `Withdraw ${new Decimal(amount).toFixed(8)} 20WETH-80WNCG`,
        }
        dispatch(addTx(tx))
        addToast(tx, `${data.hash}_withdrawAndClaim`)
      }
    },
    [addToast, contract, dispatch]
  )

  const unstakeWindow = useCallback(async () => {
    try {
      const period = await contract?.UNSTAKE_WINDOW()
      if (period) {
        dispatch(setUnstakePeriod(period.toNumber()))
      }
    } catch (error) {
      handleError(error)
    }
  }, [contract, dispatch, handleError])

  const getCooldownEndTimestamp = useCallback(async () => {
    const timestamp = await contract?.getCooldownEndTimestamp(account)
    if (!timestamp) return

    const cooldownEndsAt = timestamp.toNumber() * 1_000
    if (cooldownEndsAt > Date.now()) {
      dispatch(setCooldownEndsAt(cooldownEndsAt))
    } else {
      dispatch(resetCooldownEndsAt())
    }
  }, [account, contract, dispatch])

  const getWithdrawEndTimestamp = useCallback(async () => {
    const timestamp = await contract?.getWithdrawEndTimestamp(account)
    if (!timestamp) return

    const withdrawEndsAt = timestamp.toNumber() * 1_000
    if (withdrawEndsAt > Date.now()) {
      dispatch(setWithdrawEndsAt(withdrawEndsAt))
    } else {
      dispatch(resetWithdrawEndsAt())
    }
  }, [account, contract, dispatch])

  const getTimestamps = useCallback(async () => {
    try {
      await getCooldownEndTimestamp()
      await getWithdrawEndTimestamp()
    } catch (error) {
      handleError(error)
    }
  }, [getCooldownEndTimestamp, getWithdrawEndTimestamp, handleError])

  return {
    getTimestamps,
    startCooldown,
    withdraw,
    withdrawAndClaim,
    unstakeWindow,
  }
}
