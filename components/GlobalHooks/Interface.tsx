import { memo, useEffect } from 'react'
import { useInterval, useMount } from 'react-use'
import { useAtom, useSetAtom } from 'jotai'

import { chainIdAtom, currentTimestampAtom } from 'states/system'

import { now } from 'utils/now'
import { useFetchPrices } from 'hooks/queries'
import { useRouter } from 'next/router'
import { ChainId } from 'config/chains'
import { useRefetch } from 'hooks'

function InterfaceHook() {
  const router = useRouter()

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
