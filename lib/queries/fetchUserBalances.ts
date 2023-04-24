import { fetchBalance } from '@wagmi/core'

import config from 'config'
import { Erc20Abi } from 'config/abi'
import { readContractsPool } from 'lib/readContractsPool'

export async function fetchUserBalances(
  account: Hash,
  ...args: Hash[]
): Promise<RawBalanceMap> {
  try {
    const contracts = args.map((address) => ({
      address: address as Hash,
      abi: Erc20Abi as Abi,
      args: [account],
      chainId: config.chainId,
      functionName: 'balanceOf',
    }))

    const nativeTokenBalance = await fetchBalance({
      address: account,
      chainId: config.chainId,
    })

    const tokenBalances = (await readContractsPool.call({
      allowFailure: true,
      contracts,
    })) as BigNumber[]

    const entries = [
      [config.nativeCurrency.address, nativeTokenBalance.value],
      ...args.flatMap((a, i) => {
        if (!a) return []
        return [[a, tokenBalances[i]]]
      }),
    ]

    return Object.fromEntries(entries)
  } catch (error) {
    throw error
  }
}
