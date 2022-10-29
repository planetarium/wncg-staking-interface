import { useCallback, useMemo } from 'react'
import { parseUnits } from 'ethers/lib/utils'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { configService } from 'services/config'
import { buildExit } from 'utils/joinExit'
import { networkChainId } from 'utils/network'
import { getTokenInfo } from 'utils/token'
import { findAbiFromBalancerVault } from 'utils/wagmi'
import { useAccount, usePool } from 'hooks'

const writeConfig = Object.freeze({
  abi: findAbiFromBalancerVault('exitPool'),
  chainId: networkChainId,
  functionName: 'exitPool',
})

export function useExit(
  amounts: string[],
  assets: string[],
  bptIn: string,
  exactOut: boolean,
  isProportional: boolean,
  { onConfirm, onError }: ContractWriteOption = {}
) {
  const { account } = useAccount()
  const { poolTokenAddresses } = usePool()

  const assetDecimals = poolTokenAddresses.map(
    (address) => getTokenInfo(address).decimals
  )

  const scaledAmounts = useMemo(
    () =>
      isProportional
        ? ['0', '0']
        : amounts.map((amount, i) =>
            parseUnits(amount, assetDecimals[i]).toString()
          ),
    [amounts, assetDecimals, isProportional]
  )

  const request = useMemo(
    () =>
      buildExit({
        assets,
        bptIn,
        exactOut,
        isProportional,
        minAmountsOut: scaledAmounts,
      }),
    [assets, bptIn, exactOut, isProportional, scaledAmounts]
  )

  const { config } = usePrepareContractWrite({
    ...writeConfig,
    address: configService.vaultAddress,
    args: [configService.poolId, account, account, request],
    enabled: !!account,
  })

  const { writeAsync } = useContractWrite(config)

  const exit = useCallback(async () => {
    try {
      const response = await writeAsync?.()
      onConfirm?.(response?.hash as Hash)
    } catch (error: any) {
      onError?.(error)
      throw error
    }
  }, [onConfirm, onError, writeAsync])

  return exit
}
