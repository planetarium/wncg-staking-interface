import { useEffect, useMemo, useRef } from 'react'
import { useUnmount } from 'react-use'
import { useMachine } from '@xstate/react'
import { useAtom, useAtomValue } from 'jotai'
import { RESET } from 'jotai/utils'
import { useWaitForTransaction } from 'wagmi'

import { pendingCooldownTxAtom } from 'states/form'
import { isUnstakeWindowAtom, timestampsAtom } from 'states/user'
import { createLogger } from 'utils/log'
import { networkChainId } from 'utils/network'
import { cooldownMachine, currentPage } from './stateMachine'

import Page1 from './Page1'
import Page2 from './Page2'
import Page3 from './Page3'

const log = createLogger('black')

function CooldownModal() {
  const [cooldownEndsAt] = useAtomValue(timestampsAtom)
  const isUnstakeWindow = useAtomValue(isUnstakeWindowAtom)

  const [pendingTx, setPendingTx] = useAtom(pendingCooldownTxAtom)
  const { hash: pendingHash } = pendingTx

  const hash = pendingHash ?? undefined

  const stateMachine = useRef(cooldownMachine)
  const [state, send] = useMachine(stateMachine.current, {
    context: {
      cooldownEndsAt,
      hash,
    },
  })

  useWaitForTransaction({
    hash: hash!,
    enabled: !!hash,
    chainId: networkChainId,
    onSettled() {
      log(`Cooldown tx: ${hash?.slice(0, 6)}`)
    },
    onError() {
      send('FAIL')
    },
  })

  const page = useMemo(() => currentPage(state.value), [state.value])

  useEffect(() => {
    console.log(111, isUnstakeWindow)

    if (isUnstakeWindow) send('SUCCESS')
  }, [isUnstakeWindow, send])

  useUnmount(() => {
    if (!!state.done) {
      console.log('>>>>>>> resett')
      setPendingTx(RESET)
    }
  })

  return (
    <>
      <Page1
        currentPage={page}
        currentState={state.value}
        disabled={isUnstakeWindow}
        send={send}
      />
      <Page2
        currentPage={page}
        currentState={state.value}
        disabled={isUnstakeWindow}
        send={send}
      />
      <Page3
        currentPage={page}
        currentState={state.value}
        disabled={!isUnstakeWindow}
      />
    </>
  )
}

export default CooldownModal
