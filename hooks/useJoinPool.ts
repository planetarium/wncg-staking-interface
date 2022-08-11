import { useCallback } from 'react'
import { parseUnits } from 'ethers/lib/utils'
import { WeightedPoolEncoder } from '@balancer-labs/sdk'

import { getAccount } from 'app/states/connection'
import { addTx, TransactionAction } from 'app/states/transaction'
import { BPT_POOL_ID, IS_ETHEREUM } from 'utils/env'
import { etherToWei } from 'utils/num'
import { ethAddress, wethAddress, wncgAddress } from 'utils/token'
import { useInvestMath } from './useInvestMath'
import { useAppDispatch, useAppSelector } from './useRedux'
import { useToast } from './useToast'
import { useVaultContract } from './useVaultContract'

export function useJoinPool() {
  const { getMinBptOut } = useInvestMath()
  const { addToast } = useToast()
  const vault = useVaultContract()

  const dispatch = useAppDispatch()
  const account = useAppSelector(getAccount)

  const joinPool = useCallback(
    async (amounts: string[], ethType: EthType) => {
      if (!vault) return

      const isEth = ethType === 'eth'
      const minBptOut = getMinBptOut(amounts)
      const { request } = buildJoin({ isEth, amounts, minBptOut })

      let data
      if (isEth) {
        data = await vault.joinPool(BPT_POOL_ID, account, account, request, {
          value: etherToWei(amounts[1]),
        })
      } else {
        data = await vault.joinPool(BPT_POOL_ID, account, account, request)
      }

      if (data) {
        const tx = {
          hash: data.hash,
          action: TransactionAction.JoinPool,
          summary: 'Investing 20WETH-80WNCG pool',
        }
        dispatch(addTx(tx))
        addToast(tx, data.hash)
      }
    },
    [account, addToast, dispatch, getMinBptOut, vault]
  )

  return {
    joinPool,
  }
}

const WNCG_DECIMALS = IS_ETHEREUM ? 18 : 8

type BuildJoinParams = {
  isEth: boolean
  minBptOut: string
  amounts?: string[]
  joinInit?: boolean
}

function buildJoin({
  isEth,
  minBptOut,
  amounts = ['0', '0'],
  joinInit = false,
}: BuildJoinParams) {
  const assets = isEth ? [wncgAddress, ethAddress] : [wncgAddress, wethAddress]
  const maxAmountsIn = [
    parseUnits(amounts[0], WNCG_DECIMALS).toString(),
    etherToWei(amounts[1]),
  ]

  const userData = joinInit
    ? WeightedPoolEncoder.joinInit(maxAmountsIn)
    : WeightedPoolEncoder.joinExactTokensInForBPTOut(maxAmountsIn, minBptOut)

  const request = {
    assets,
    maxAmountsIn,
    userData,
    fromInternalBalance: false,
  }

  return {
    request,
  }
}
