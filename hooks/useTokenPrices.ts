import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { usePrevious } from 'react-use'

import { setBalPrice, setWethPrice, setWncgPrice } from 'app/states/token'
import { coingecko, tokenIds } from 'lib/coingecko'
import { useAppDispatch } from 'hooks'

export function useTokenPrices() {
  const dispatch = useAppDispatch()

  const { data } = useQuery('tokenPrices', fetchTokenPrices, {
    staleTime: 10 * 1_000,
  })

  const { bal, weth, wncg } = data || {}
  const {
    bal: prevBal,
    weth: prevWeth,
    wncg: prevWncg,
  } = usePrevious(data) || {}

  useEffect(() => {
    if (prevBal !== bal) dispatch(setBalPrice(bal))
  }, [bal, dispatch, prevBal])

  useEffect(() => {
    if (prevWeth !== weth) dispatch(setWethPrice(weth))
  }, [weth, dispatch, prevWeth])

  useEffect(() => {
    if (prevWncg !== wncg) dispatch(setWncgPrice(wncg))
  }, [wncg, dispatch, prevWncg])
}

async function fetchTokenPrices() {
  return await coingecko.getTokens(tokenIds)
}
