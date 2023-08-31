import { useMemo } from 'react'
import { useQuery } from 'wagmi'
import { PublicClient } from 'viem'
import { CurrencyAmount, Pair, Token } from '@pancakeswap/sdk'

import { PancakePairAbi } from 'config/abi'
import { parseUnits } from 'utils/parseUnits'
import { useChain, useStaking, useViemClients } from 'hooks'

async function fetchPairReserves(client: PublicClient, lpTokenAddress: Hash) {
  try {
    const data = (await client.readContract({
      address: lpTokenAddress,
      abi: PancakePairAbi,
      functionName: 'getReserves',
    })) as [BigInt, BigInt, BigInt]

    return [data[0], data[1]]
  } catch (error) {
    throw error
  }
}

export function useV2Pair() {
  const { chainId } = useChain()
  const { lpToken } = useStaking()
  const { publicClient } = useViemClients()
  const {
    poolTokens,
    poolTokenBalances: initPoolTokenBalances,
    poolTokenDecimals,
  } = useStaking()

  const scaledInitPoolTokenBalances = initPoolTokenBalances.map((b, i) =>
    BigInt(parseUnits(b, poolTokenDecimals[i]).toString())
  )

  const scaledPoolTokenBalances =
    useQuery(
      ['getReserves', chainId],
      () => fetchPairReserves(publicClient, lpToken.address),
      { enabled: !!publicClient }
    ).data || scaledInitPoolTokenBalances

  const [token0, token1] = useMemo(
    () =>
      poolTokens.map(
        (t) => new Token(chainId, t.address, t.decimals, t.symbol, t.name)
      ),
    [chainId, poolTokens]
  )

  return useMemo(
    () =>
      new Pair(
        CurrencyAmount.fromRawAmount(
          token0,
          scaledPoolTokenBalances[0].toString()
        ),
        CurrencyAmount.fromRawAmount(
          token1,
          scaledPoolTokenBalances[1].toString()
        )
      ),
    [scaledPoolTokenBalances, token0, token1]
  )
}
