import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CurrencyAmount, Pair, Token } from '@pancakeswap/aptos-swap-sdk'

import { QUERY_KEYS } from 'config/constants/queryKeys'
import { fetchPancakeSwapPool } from 'lib/pancakeswap/fetchPancakeSwapPool'
import { parseUnits } from 'utils/parseUnits'
import { useChain, useStaking } from 'hooks'

export function usePair() {
  const { chainId } = useChain()
  const { lpToken, poolTokens } = useStaking()

  const {
    data = {
      reserves: [],
      totalSupply: '0',
    },
  } = useQuery(
    [QUERY_KEYS.Pool.LatestPoolStatus, chainId],
    () => fetchPancakeSwapPool(chainId),
    {
      staleTime: 5 * 1_000,
      select(data) {
        return {
          reserves: data.reserves.map((d, i) =>
            parseUnits(d, poolTokens[i].decimals).toString()
          ),
          totalSupply: parseUnits(data.totalSupply, lpToken.decimals),
        }
      },
    }
  )

  return useMemo(() => {
    return new Pair(
      CurrencyAmount.fromRawAmount(
        new Token(
          chainId,
          poolTokens[0].address,
          poolTokens[0].decimals,
          poolTokens[0].symbol
        ),
        data.reserves[0] ?? '0'
      ),
      CurrencyAmount.fromRawAmount(
        new Token(
          chainId,
          poolTokens[1].address,
          poolTokens[1].decimals,
          poolTokens[1].symbol
        ),
        data.reserves[1] ?? '0'
      )
    )
  }, [chainId, data.reserves, poolTokens])
}
