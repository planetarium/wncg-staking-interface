import { memo } from 'react'
import { useInterval, useMount } from 'react-use'
import { useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import { currentTimestampAtom, priceMapAtom } from 'states/system'
import { queryKeys } from 'config/queryKeys'
import { now } from 'utils/now'
import { useFetchPrices } from 'hooks/queries'

function InterfaceHook() {
  const queryClient = useQueryClient()

  const setCurrentTimestamp = useSetAtom(currentTimestampAtom)
  const setPriceMap = useSetAtom(priceMapAtom)

  useFetchPrices()

  useInterval(() => {
    setCurrentTimestamp(now())
  }, 10 * 1_000)

  useMount(() => {
    setCurrentTimestamp(now())
  })

  useMount(() => {
    const defaultPriceMap = (queryClient.getQueryData(
      [queryKeys.FallbackPrices],
      { exact: false }
    ) ?? {}) as PriceMap

    setPriceMap(defaultPriceMap)
  })

  return null
}

export default memo(InterfaceHook)
