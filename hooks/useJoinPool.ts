import { useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import { parseUnits } from 'ethers/lib/utils'
import { isSameAddress } from '@balancer-labs/sdk'

import { accountState } from 'app/states/connection'
import { joinPool as initJoinPool } from 'contracts/vault'
import { configService } from 'services/config'
import { TxAction } from 'services/transaction'
import { useJoinMath } from './useJoinMath'
import { usePool } from './usePool'
import { useTx } from './useTx'
import { useVaultContract } from './useVaultContract'

export function useJoinPool() {
  const { calcMinBptOut } = useJoinMath()
  const { poolTokenAddresses, poolTokenDecimals, poolName, nativeAssetIndex } =
    usePool()

  const { registerTx } = useTx()
  const vault = useVaultContract()

  const account = useRecoilValue(accountState)

  const joinPool = useCallback(
    async (amounts: string[], isNativeAsset: boolean) => {
      if (!vault || !account) return

      const assets = poolTokenAddresses.map((address) => {
        if (isNativeAsset && isSameAddress(address, configService.weth))
          return configService.zeroAddress
        return address
      })
      const maxAmountsIn = amounts.map((amount, i) =>
        parseUnits(amount, poolTokenDecimals[i]).toString()
      )
      const minBptOut = calcMinBptOut(amounts)

      const response = await initJoinPool(vault, account, {
        amounts: maxAmountsIn,
        assets,
        isNativeAsset,
        minBptOut,
        nativeAssetIndex,
        poolId: configService.poolId,
      })
      registerTx?.(response, TxAction.JoinPool, poolName)
    },
    [
      vault,
      account,
      poolTokenAddresses,
      calcMinBptOut,
      nativeAssetIndex,
      registerTx,
      poolName,
      poolTokenDecimals,
    ]
  )

  return {
    joinPool,
  }
}
