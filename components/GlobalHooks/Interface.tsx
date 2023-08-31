import { useInterval } from 'react-use'
import dynamic from 'next/dynamic'
import { useSetAtom } from 'jotai'

import { currentTimestampAtom } from 'states/system'
import { now } from 'utils/now'
import { useClientMount } from 'hooks'
import { useFetchPrices } from 'hooks/queries'

function InterfaceHook() {
  const setCurrentTimestamp = useSetAtom(currentTimestampAtom)

  useFetchPrices({
    refetchInterval: 60 * 60 * 3 * 1_000, // 3 hour
  })

  useInterval(() => {
    setCurrentTimestamp(now())
  }, 10 * 1_000)

  useClientMount(() => {
    setCurrentTimestamp(now())
  })

  return null
}

export default dynamic(() => Promise.resolve(InterfaceHook), {
  ssr: false,
})
