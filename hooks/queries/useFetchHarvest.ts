import { useQuery } from '@tanstack/react-query'
import { useAtomValue, useSetAtom } from 'jotai'

import { currentTimestampAtom, isHarvestableAtom } from 'states/system'
import { QUERY_KEYS } from 'config/constants/queryKeys'
import { isEthereum } from 'utils/isEthereum'
import { fetchHarvest } from 'lib/queries/fetchHarvest'
import { useChain, useStaking } from 'hooks'
import { bnum } from 'utils/bnum'

export function useFetchHarvest(options: UseFetchOptions = {}) {
  const {
    enabled: _enabled = true,
    refetchInterval,
    refetchOnWindowFocus,
    suspense = true,
  } = options

  const { chainId } = useChain()
  const { balRewardPoolAddress } = useStaking<'ethereum'>()

  const currentTimestamp = useAtomValue(currentTimestampAtom)
  const setIsHarvestable = useSetAtom(isHarvestableAtom)

  const enabled = isEthereum(chainId)

  return useQuery(
    [QUERY_KEYS.Harvest, chainId],
    () => fetchHarvest(chainId, balRewardPoolAddress),
    {
      enabled,
      refetchInterval,
      refetchOnWindowFocus,
      suspense,
      onSuccess(data) {
        if (bnum(data).gt(currentTimestamp)) setIsHarvestable(false)
        else setIsHarvestable(true)
      },
    }
  )
}
