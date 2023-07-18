import { readContracts } from 'wagmi'

import { PancakePairAbi } from 'config/abi'
import { ChainId, CHAINS } from 'config/chains'
import { bnum } from 'utils/bnum'
import { formatUnits } from 'utils/formatUnits'
import { resolveReadContractsResult } from 'utils/resolveReadContractsResult'
import { fetchPoolTokens } from './fetchPoolTokens'

const FNS = [
  'decimals',
  'name',
  'symbol',
  'totalSupply',
  'token0',
  'token1',
  'getReserves',
]

export async function fetchPancakeSwapPool(
  chainId: ChainId,
  stakedTokenAddress: Hash
): Promise<LiquidityPool> {
  const { nativeCurrency } = CHAINS[chainId]

  const contracts = FNS.map((fn) => ({
    address: stakedTokenAddress as Hash,
    abi: PancakePairAbi as Abi,
    chainId,
    functionName: fn,
  }))

  const data = await readContracts({
    allowFailure: true,
    contracts,
  })

  const [
    _decimals,
    _name = '',
    _symbol = '',
    _totalSupply,
    _token0,
    _token1,
    _reserves,
  ] = resolveReadContractsResult(data) as [
    number,
    string,
    string,
    BigInt,
    Hash,
    Hash,
    [BigInt, BigInt, BigInt]
  ]

  const poolTokens = await fetchPoolTokens(
    chainId,
    stakedTokenAddress as Hash,
    [_token0, _token1]
  )

  const poolTokenAddresses = poolTokens.map((t) => t.address)
  const poolTokenBalances = poolTokens.map((t) => t.balance)
  const poolTokenDecimals = poolTokens.map((t) => t.decimals)
  const poolTokenWeights = poolTokens.map((t) => t.weight)
  const poolTokenWeightsInPcnt = poolTokenWeights.map((weight) =>
    bnum(weight).times(100).toNumber()
  )
  const poolTokenSymbols = poolTokens.map((t) => t.symbol)

  const poolReserves = _reserves.flatMap((amt, i) => {
    if (i === 2) return []
    return [formatUnits(amt.toString(), poolTokenDecimals[i])]
  })

  const shouldReversePoolTokenOrderOnDisplay =
    poolTokenAddresses.findIndex(
      (addr) => addr === nativeCurrency.wrappedTokenAddress
    ) === 0

  return {
    lpToken: {
      address: stakedTokenAddress as Hash,
      decimals: 18,
      name: 'Cake-LP',
      symbol: poolTokenSymbols.join('-'),
      totalSupply: formatUnits(_totalSupply.toString(), _decimals),
    },

    poolTokens,
    poolTokenAddresses,
    poolTokenBalances,
    poolTokenDecimals,
    poolTokenWeights,
    poolTokenWeightsInPcnt,
    poolTokenSymbols,

    totalSwapFee: '0',
    shouldReversePoolTokenOrderOnDisplay,
  }
}
