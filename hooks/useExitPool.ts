import { useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import { parseUnits } from 'ethers/lib/utils'

import { accountState } from 'app/states/connection'
import { exitPool as initExitPool } from 'contracts/vault'
import { configService } from 'services/config'
import { TxAction } from 'services/transaction'
import { useExitMath } from './useExitMath'
import { usePool } from './usePool'
import { useTx } from './useTx'
import { useVaultContract } from './useVaultContract'

type ExitPoolParams = {
  exactOut: boolean
  isNativeAsset: boolean
  isProportional: boolean
  percent: number
  tokenOutAmount: string
  tokenOutIndex: number
}

export function useExitPool() {
  const { calcAmountsOut, calcBptIn } = useExitMath()
  const {
    nativeAssetIndex,
    poolId,
    poolName,
    poolTokenAddresses,
    poolTokenDecimals,
  } = usePool()
  const { registerTx } = useTx()
  const vault = useVaultContract()

  const account = useRecoilValue(accountState)

  const exitPool = useCallback(
    async (params: ExitPoolParams) => {
      if (!vault || !account) return

      const {
        exactOut,
        isNativeAsset,
        isProportional,
        percent,
        tokenOutAmount,
        tokenOutIndex,
      } = params

      const assets = poolTokenAddresses.map((address, i) => {
        if (isNativeAsset && i === nativeAssetIndex) {
          return configService.zeroAddress
        }
        return address
      })

      const amountsOut = calcAmountsOut({
        exactOut,
        isProportional,
        tokenOutIndex,
        tokenOutAmount,
        percent,
      })

      const amountsOutScaled = amountsOut.map((amount, i) =>
        parseUnits(amount, poolTokenDecimals[i]).toString()
      )

      const bptIn = calcBptIn({
        exactOut,
        isProportional,
        tokenOutIndex,
        tokenOutAmount,
        percent,
      })

      const response = await initExitPool(vault, account, {
        amounts: amountsOutScaled,
        assets,
        bptIn,
        exactOut,
        isProportional,
        poolId,
        tokenOutIndex,
      })
      registerTx?.(response, TxAction.ExitPool, poolName)
      return response.hash
    },
    [
      account,
      calcAmountsOut,
      calcBptIn,
      nativeAssetIndex,
      poolId,
      poolName,
      poolTokenAddresses,
      poolTokenDecimals,
      registerTx,
      vault,
    ]
  )

  return {
    exitPool,
  }
}
