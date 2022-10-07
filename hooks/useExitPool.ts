import { useCallback } from 'react'
import { parseUnits } from 'ethers/lib/utils'

import { exitPool as initExitPool } from 'contracts/vault'
import { configService } from 'services/config'
import { gaEvent } from 'lib/gtag'
import { useAccount } from './useAccount'
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
  const { account } = useAccount()
  const { calcAmountsOut, calcBptIn } = useExitMath()
  const { nativeAssetIndex, poolId, poolTokenAddresses, poolTokenDecimals } =
    usePool()
  const { subscribeTx } = useTx()
  const vault = useVaultContract()

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
      subscribeTx?.(response)
      gaEvent({
        name: `exit_pool`,
        params: {
          account,
          amounts: amountsOut,
          bptIn,
        },
      })
      return response.hash
    },
    [
      account,
      calcAmountsOut,
      calcBptIn,
      nativeAssetIndex,
      poolId,
      poolTokenAddresses,
      poolTokenDecimals,
      subscribeTx,
      vault,
    ]
  )

  return {
    exitPool,
  }
}
