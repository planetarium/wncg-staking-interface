import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { usePrevious } from 'react-use'

import { setPool } from 'app/states/pool'
import { fetchPool } from 'lib/graphql'
import { useAppDispatch } from './useRedux'

export function usePool() {
  const dispatch = useAppDispatch()

  const { data } = useQuery<Pool>('pool', fetchPool, {
    staleTime: 10 * 1_000,
  })
  const prevPool = usePrevious(data)

  useEffect(() => {
    if (prevPool !== data && data) {
      dispatch(setPool(data))
    }
  }, [data, dispatch, prevPool])
}
