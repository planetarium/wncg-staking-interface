import { memo } from 'react'
import { useInterval } from 'react-use'
import { useSetAtom } from 'jotai'

import { currentTimestampAtom } from 'states/system'
import { now } from 'utils/now'

import {
  useFetchPrices,
  useFetchStaking,
  useFetchUserData,
} from 'hooks/queries'

function BaseEffects() {
  const setCurrentTimestamp = useSetAtom(currentTimestampAtom)

  useFetchPrices()

  useFetchStaking({
    refetchInterval: 30 * 1_000,
  })

  useFetchUserData({
    refetchInterval: 30 * 1_000,
  })

  useInterval(() => {
    setCurrentTimestamp(now())
  }, 10 * 1_000)

  return null
}

export default memo(BaseEffects)
