import { memo } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { useBlockNumber } from 'wagmi'

import { unstakeTimestampsAtom } from 'states/account'
import { currentTimestampAtom } from 'states/system'
import config from 'config'
import { now } from 'utils/now'
import { bnum } from 'utils/bnum'
import { useAuth } from 'hooks'

function UnstakeHook() {
  const { account } = useAuth()

  const [currentTimestamp, setCurrentTimestamp] = useAtom(currentTimestampAtom)
  const { cooldowns = 0 } = useAtomValue(unstakeTimestampsAtom) ?? {}

  const enabled = !!account && bnum(cooldowns).gt(0) && !!currentTimestamp

  useBlockNumber({
    chainId: config.chainId,
    enabled,
    onBlock() {
      setCurrentTimestamp(now())
    },
  })

  return null
}

export default memo(UnstakeHook)
