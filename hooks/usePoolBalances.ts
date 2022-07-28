import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { usePrevious } from 'react-use'

import { setTotalWethSupply, setTotalWncgSupply } from 'app/states/token'
import { fetchPoolTokenBalances } from 'lib/graphql'
import { IS_ETHEREUM } from 'utils/env'
import { useAppDispatch } from 'hooks'

type PoolToken = {
  symbol: string
  balance: string
}

export function usePoolBalances() {
  const dispatch = useAppDispatch()
  const WNCG_TOKEN = IS_ETHEREUM ? 'WNCG' : 'WBTC'

  const { data } = useQuery('poolTokenBalances', fetchPoolTokenBalances, {
    staleTime: 10 * 1_000,
  })

  const tokens: PoolToken[] = data || []
  const wethSupply = tokens.find((t) => t.symbol === 'WETH')?.balance || '0'
  const wncgSupply = tokens.find((t) => t.symbol === WNCG_TOKEN)?.balance || '0'
  const prevWethSupply = usePrevious(wethSupply)
  const prevWncgSupply = usePrevious(wncgSupply)

  useEffect(() => {
    if (prevWethSupply !== wethSupply) dispatch(setTotalWethSupply(wethSupply))
  }, [dispatch, prevWethSupply, wethSupply])

  useEffect(() => {
    if (prevWncgSupply !== wncgSupply) dispatch(setTotalWncgSupply(wncgSupply))
  }, [dispatch, prevWncgSupply, wncgSupply])
}
