import { memo } from 'react'
import { useInterval, useMount } from 'react-use'
import { useSetAtom } from 'jotai'

import { currentTimestampAtom } from 'states/system'

import { now } from 'utils/now'
import { useFetchPrices } from 'hooks/queries'

function InterfaceHook() {
  const setCurrentTimestamp = useSetAtom(currentTimestampAtom)

  useFetchPrices({
    refetchInterval: 60 * 60 * 3 * 1_000, // 3 hour
  })

  useInterval(() => {
    setCurrentTimestamp(now())
  }, 10 * 1_000)

  useMount(() => {
    setCurrentTimestamp(now())
  })

  return null
}

export default memo(InterfaceHook)
