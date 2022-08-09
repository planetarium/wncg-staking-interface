import { useQuery } from 'react-query'
import { useSetRecoilState } from 'recoil'

import { fetchPool } from 'lib/graphql'
import { poolState } from 'app/states/pool'

export function useFetchPool() {
  const setPool = useSetRecoilState(poolState)

  const { refetch } = useQuery<Pool>('pool', fetchPool, {
    staleTime: 10 * 1_000,
    onSuccess(data) {
      setPool(data)
    },
  })

  return {
    fetchPool: refetch,
  }
}
