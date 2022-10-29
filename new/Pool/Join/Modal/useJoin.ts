import { useCallback, useMemo } from 'react'
import { parseEther, parseUnits } from 'ethers/lib/utils'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { configService } from 'services/config'
import { buildJoin } from 'utils/joinExit'
import { networkChainId } from 'utils/network'
import { getTokenInfo } from 'utils/token'
import { findAbiFromBalancerVault } from 'utils/wagmi'
import { useAccount, useAllowances } from 'hooks'
import { useJoinMath } from '../useJoinMath'

const writeConfig = Object.freeze({
  address: configService.vaultAddress,
  abi: findAbiFromBalancerVault('joinPool'),
  chainId: networkChainId,
  functionName: 'joinPool',
})

export function useJoin(
  amounts: string[],
  _assets: string[],
  { onConfirm, onError }: ContractWriteOption = {}
) {
  const { account } = useAccount()
  const { allowanceFor } = useAllowances()
  const { calcMinBptOut } = useJoinMath()
  const assets = _assets.map((address) =>
    address === configService.nativeAssetAddress
      ? configService.zeroAddress
      : address
  )
  const assetDecimals = _assets.map((address) => getTokenInfo(address).decimals)

  const scaledAmounts = amounts.map((amount, i) =>
    parseUnits(amount, assetDecimals[i]).toString()
  )
  const minBptOut = calcMinBptOut(amounts)

  const request = useMemo(
    () =>
      buildJoin({
        assets,
        maxAmountsIn: scaledAmounts,
        minBptOut,
        joinInit: false,
      }),
    [assets, minBptOut, scaledAmounts]
  )

  const isAllApproved = assets.every((address) => {
    if (address === configService.zeroAddress) return true
    return allowanceFor(address, configService.vaultAddress)
  })

  const nativeAssetAmount = amounts.find((_, i) => {
    return assets[i] === configService.zeroAddress
  })
  const hasNativeAsset = !!nativeAssetAmount

  const { config } = usePrepareContractWrite({
    ...writeConfig,
    args: [configService.poolId, account, account, request],
    enabled: !!account && isAllApproved,
    overrides: hasNativeAsset && {
      from: account,
      value: parseEther(nativeAssetAmount),
    },
  })

  const { writeAsync } = useContractWrite(config)

  const join = useCallback(async () => {
    try {
      const response = await writeAsync?.()
      onConfirm?.(response?.hash as Hash)
    } catch (error: any) {
      onError?.(error)
      throw error
    }
  }, [onConfirm, onError, writeAsync])

  return join
}
