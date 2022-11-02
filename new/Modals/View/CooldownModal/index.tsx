import { useMemo, useRef } from 'react'
import { useMachine } from '@xstate/react'
import { useAtom } from 'jotai'

import { pendingCooldownTxAtom } from 'states/form'
import { cooldownMachine, currentPage } from './stateMachine'

import Page1 from './Page1'
import Page2 from './Page2'
import Page3 from './Page3'

function CooldownModal() {
  const [pendingTx, setPendingTx] = useAtom(pendingCooldownTxAtom)
  const { hash: pendingHash } = pendingTx

  const hash = pendingHash ?? undefined

  const stateMachine = useRef(cooldownMachine)
  const [state, send] = useMachine(stateMachine.current, {
    context: {
      hash,
    },
  })

  const page = useMemo(() => currentPage(state.value), [state.value])

  return (
    <>
      <Page1 currentPage={page} currentState={state.value} send={send} />
      <Page2 currentPage={page} currentState={state.value} send={send} />
      <Page3 currentPage={page} currentState={state.value} />
    </>
  )
}

export default CooldownModal
