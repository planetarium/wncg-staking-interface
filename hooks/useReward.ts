import { useCallback, useMemo } from 'react'
import { Contract } from 'ethers'

import { getAccount, getIsValidNetwork } from 'app/states/connection'
import {
  getBalRewardContractAddress,
  setBalRewardAddress,
} from 'app/states/contract'
import {
  setBalEmissionPerSec,
  setEarmarkIncentive,
  setEarnedBal,
  setEarnedWncg,
  setWncgEmissionPerSec,
} from 'app/states/reward'
import { addTx, TransactionAction } from 'app/states/transaction'
import { balRewardAbi } from 'lib/abis'
import Decimal, { weiToEther } from 'utils/num'
import { useContract } from './useContract'
import { useError } from './useError'
import { useFee } from './useFee'
import { useProvider } from './useProvider'
import { useAppDispatch, useAppSelector } from './useRedux'
import { useToast } from './useToast'

const stakingContractAddress = process.env
  .NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS as string

export function useReward() {
  const contract = useContract()
  const { handleError } = useError()
  const { earmarkIncentiveFee, feeDenominator } = useFee()
  const provider = useProvider()
  const { addToast } = useToast()

  const dispatch = useAppDispatch()
  const account = useAppSelector(getAccount)
  const balRewardContractAddress = useAppSelector(getBalRewardContractAddress)
  const isValidNetwork = useAppSelector(getIsValidNetwork)

  const balRewardContract = useMemo(() => {
    if (!provider || !balRewardContractAddress || !isValidNetwork || !account) {
      return null
    }
    return new Contract(
      balRewardContractAddress,
      balRewardAbi,
      provider.getSigner(account)
    )
  }, [account, balRewardContractAddress, isValidNetwork, provider])

  const balRewardPool = useCallback(async () => {
    try {
      const address = await contract?.balancerGauge()
      if (address) {
        dispatch(setBalRewardAddress(address))
      }
    } catch (error) {
      handleError(error)
    }
  }, [contract, dispatch, handleError])

  const earmarkIncentive = useCallback(async () => {
    if (!balRewardContract) return

    try {
      const claimableTokens = await balRewardContract.claimable_tokens(
        stakingContractAddress
      )
      const fee = await earmarkIncentiveFee()
      const denominator = await feeDenominator()

      if (claimableTokens && fee && denominator) {
        const tokens = weiToEther(claimableTokens)
        const incentive = new Decimal(tokens)
          .mul(fee)
          .div(denominator)
          .toString()

        dispatch(setEarmarkIncentive(incentive))
      }
    } catch (error) {
      handleError(error)
    }
  }, [
    balRewardContract,
    dispatch,
    earmarkIncentiveFee,
    feeDenominator,
    handleError,
  ])

  const earmarkRewards = useCallback(async () => {
    const data = await contract?.earmarkRewards()
    if (data) {
      const tx = {
        hash: data.hash,
        action: TransactionAction.EarmarkRewards,
        summary: 'Harvest BAL reward',
      }
      dispatch(addTx(tx))
      addToast(tx, data.hash)
    }
  }, [addToast, contract, dispatch])

  const earnedBal = useCallback(async () => {
    try {
      const balReward = await contract?.earnedBAL(account)
      if (balReward) {
        dispatch(setEarnedBal(weiToEther(balReward)))
      }
    } catch (error) {
      handleError(error)
    }
  }, [account, contract, dispatch, handleError])

  const earnedWncg = useCallback(async () => {
    try {
      const wncgReward = await contract?.earnedWNCG(account)
      if (wncgReward) {
        dispatch(setEarnedWncg(weiToEther(wncgReward)))
      }
    } catch (error) {
      handleError(error)
    }
  }, [account, contract, dispatch, handleError])

  const getBalEmissionPerSec = useCallback(async () => {
    try {
      const balEmission = await contract?.getBALRewardRate()
      if (balEmission) {
        dispatch(setBalEmissionPerSec(weiToEther(balEmission)))
      }
    } catch (error) {
      handleError(error)
    }
  }, [contract, dispatch, handleError])

  const getWncgEmissionPerSec = useCallback(async () => {
    try {
      const wncgEmission = await contract?.getWNCGEmissionPerSec()
      if (wncgEmission) {
        dispatch(setWncgEmissionPerSec(weiToEther(wncgEmission)))
      }
    } catch (error) {
      handleError(error)
    }
  }, [contract, dispatch, handleError])

  return {
    balRewardPool,
    earmarkIncentive,
    earmarkRewards,
    earnedBal,
    earnedWncg,
    getBalEmissionPerSec,
    getWncgEmissionPerSec,
  }
}
