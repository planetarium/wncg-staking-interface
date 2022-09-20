import { useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import { parseUnits } from 'ethers/lib/utils'

import { accountState } from 'app/states/connection'
import { joinPool as initJoinPool } from 'contracts/vault'
import { configService } from 'services/config'
import { gaEvent } from 'lib/gtag'
import { useJoinMath } from './useJoinMath'
import { usePool } from './usePool'
import { useTx } from './useTx'
import { useVaultContract } from './useVaultContract'

export function useJoinPool() {
  const { calcMinBptOut } = useJoinMath()
  const { nativeAssetIndex, poolId, poolTokenAddresses, poolTokenDecimals } =
    usePool()
  const { subscribeTx } = useTx()
  const vault = useVaultContract()

  const account = useRecoilValue(accountState)

  const joinPool = useCallback(
    async (amountsIn: string[], isNativeAsset: boolean) => {
      if (!vault || !account) return

      const assets = poolTokenAddresses.map((address, i) => {
        if (isNativeAsset && i === nativeAssetIndex)
          return configService.zeroAddress
        return address
      })

      const amountsInScaled = amountsIn.map((amount, i) =>
        parseUnits(amount, poolTokenDecimals[i]).toString()
      )

      const minBptOut = calcMinBptOut(amountsIn)

      const response = await initJoinPool(vault, account, {
        amounts: amountsInScaled,
        assets,
        isNativeAsset,
        minBptOut,
        nativeAssetIndex,
        poolId,
      })
      subscribeTx?.(response)

      gaEvent({
        name: `join_pool`,
        params: {
          account,
          amounts: amountsIn,
        },
      })
    },
    [
      account,
      calcMinBptOut,
      nativeAssetIndex,
      poolId,
      poolTokenAddresses,
      poolTokenDecimals,
      subscribeTx,
      vault,
    ]
  )

  return {
    joinPool,
  }
}
