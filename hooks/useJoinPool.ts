import { useCallback } from 'react'
import { parseUnits } from 'ethers/lib/utils'
import { WeightedPoolEncoder } from '@balancer-labs/sdk'

import { getAccount } from 'app/states/connection'
import { addTx, TransactionAction } from 'app/states/transaction'
import { BPT_POOL_ID, IS_ETHEREUM } from 'utils/env'
import { etherToWei } from 'utils/num'
import { ethAddress, wethAddress, wncgAddress } from 'utils/token'
import { useJoinMath } from './useJoinMath'
import { useAppDispatch, useAppSelector } from './useRedux'
import { useToast } from './useToast'
import { useVaultContract } from './useVaultContract'

export function useJoinPool() {
  const { getMinBptOut } = useJoinMath()
  const { addToast } = useToast()
  const vault = useVaultContract()

  const dispatch = useAppDispatch()
  const account = useAppSelector(getAccount)

  const joinPool = useCallback(
    async (amounts: string[], isNativeAsset: boolean) => {
      if (!vault) return

      const minBptOut = getMinBptOut(amounts)
      const { request } = buildJoin({ isNativeAsset, amounts, minBptOut })

      let data
      if (isNativeAsset) {
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
          summary: 'Joining 20WETH-80WNCG pool',
        }
        dispatch(addTx(tx))
        addToast(tx, data.hash, {
          action: TransactionAction.JoinPool,
        })
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
  isNativeAsset: boolean
  minBptOut: string
  amounts?: string[]
  joinInit?: boolean
}

function buildJoin({
  isNativeAsset,
  minBptOut,
  amounts = ['0', '0'],
  joinInit = false,
}: BuildJoinParams) {
  const etherAddress = isNativeAsset ? ethAddress : wethAddress
  const assets = [wncgAddress, etherAddress]

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
