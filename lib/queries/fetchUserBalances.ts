import { fetchBalance } from '@wagmi/core'
import { erc20ABI } from 'wagmi'

import { NATIVE_CURRENCY_ADDRESS } from 'config/constants/addresses'
import { readContractsPool } from 'lib/readContractsPool'
import { formatUnits } from 'utils/formatUnits'
import { resolveReadContractsResult } from 'utils/resolveReadContractsResult'

export async function fetchUserBalances(
  chainId: ChainId,
  account: Hash | null,
  addresses: Hash[],
  decimals: number[]
): Promise<RawBalanceMap> {
  if (account == null) return {}

  const contracts = addresses.map((addr) => ({
    address: addr,
    abi: erc20ABI,
    functionName: 'balanceOf',
    chainId,
    args: [account],
  }))

  const _data = await readContractsPool.call({
    allowFailure: true,
    contracts,
  })
  const nativeAssetBalance = await fetchBalance({
    address: account,
    chainId,
  })

  const data = resolveReadContractsResult(_data) as BigInt[]

  try {
    const entries = [
      [NATIVE_CURRENCY_ADDRESS, nativeAssetBalance.formatted],
      ...data.map((amt, i) => [
        addresses[i],
        formatUnits(amt.toString(), decimals[i]),
      ]),
    ]

    // console.log('🩵 BALANCES')

    return Object.fromEntries(entries)
  } catch (error) {
    throw error
  }
}
