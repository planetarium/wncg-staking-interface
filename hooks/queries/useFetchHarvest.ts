import { useQuery } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import { isHarvestableAtom } from 'states/system'
import { QUERY_KEYS } from 'config/constants/queryKeys'
import { fetchHarvest } from 'lib/queries/fetchHarvest'
import { bnum } from 'utils/bnum'
import { isEthereum } from 'utils/isEthereum'
import { useChain, useStaking } from 'hooks'
import { now } from 'utils/now'

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

  const setIsHarvestable = useSetAtom(isHarvestableAtom)

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
        const currentTimestamp = now()
        if (bnum(periodFinish).gt(currentTimestamp)) setIsHarvestable(false)
        else setIsHarvestable(true)
      },
    }
  )
}
