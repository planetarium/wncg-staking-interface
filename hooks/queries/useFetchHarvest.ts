import { useQuery } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import { periodFinishAtom } from 'states/system'
import { QUERY_KEYS } from 'config/constants/queryKeys'
import { fetchHarvest } from 'lib/queries/fetchHarvest'
import { isEthereum } from 'utils/isEthereum'
import { useChain, useStaking } from 'hooks'

export function useFetchHarvest(options: UseFetchOptions = {}) {
  const {
    enabled: _enabled = true,
    refetchInterval,
    refetchOnWindowFocus,
    suspense = true,
  } = options

  const { chainId } = useChain()
  const { balRewardPoolAddress, balancerGaugeAddress } =
    useStaking<'ethereum'>()

  const setPeriodFinish = useSetAtom(periodFinishAtom)

  const enabled = isEthereum(chainId)

  return useQuery(
    [QUERY_KEYS.Harvest, chainId],
    () => fetchHarvest(chainId, balRewardPoolAddress, balancerGaugeAddress),
    {
      enabled,
      refetchInterval,
      refetchOnWindowFocus,
      suspense,
      onSuccess(data) {
        const { periodFinish } = data
        setPeriodFinish(periodFinish)
      },
    }
  )
}
