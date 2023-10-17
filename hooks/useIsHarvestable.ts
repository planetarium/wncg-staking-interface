import { useMemo } from 'react'
import { useAtomValue } from 'jotai'

import { currentTimestampAtom, periodFinishAtom } from 'states/system'
import { isEthereum } from 'utils/isEthereum'
import { useChain } from './useChain'
import { bnum } from 'utils/bnum'

export function useIsHarvestable() {
  const { chainId } = useChain()

  const periodFinish = useAtomValue(periodFinishAtom)
  const currentTimestamp = useAtomValue(currentTimestampAtom)

  const isHarvestable = useMemo(() => {
    if (!isEthereum(chainId)) return false
    if (bnum(currentTimestamp).isZero()) return false
    return bnum(periodFinish).lte(currentTimestamp)
  }, [chainId, currentTimestamp, periodFinish])

  return isHarvestable
}
