import { erc20ABI } from 'wagmi'

import { readContractsPool } from 'lib/readContractsPool'
import { formatUnits } from 'utils/formatUnits'
import { resolveReadContractsResult } from 'utils/resolveReadContractsResult'

export async function fetchUserAllowances(
  chainId: ChainId,
  account: Hash | null,
  pairs: AllowancePair[]
) {
  if (account == null) return {}

  const contracts = pairs.map(([t, spender]) => ({
    address: t.address,
    abi: erc20ABI,
    args: [account, spender],
    chainId,
    functionName: 'allowance',
  }))

  try {
    const _data = await readContractsPool.call({
      allowFailure: true,
      contracts,
    })

    const data = resolveReadContractsResult(_data) as BigInt[]

    const entries = pairs.map(([t, spender], i) => [
      t.address,
      { [spender]: formatUnits(data[i].toString(), t.decimals) },
    ])

    // console.log('💙 ALLOWANCES')

    return Object.fromEntries(entries)
  } catch (error) {
    throw error
  }
}
