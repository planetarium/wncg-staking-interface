import { useRef } from 'react'
import { useUnmount } from 'react-use'
import { useMachine } from '@xstate/react'
import { useAtomValue } from 'jotai'

import { cooldownTxAtom } from 'states/tx'
import { ToastType } from 'config/constants'
import { useToast } from 'hooks'
import { cooldownMachine, pageFor } from './stateMachine'
import { useWatch } from './useWatch'

import Page2 from './Page2'
import Page3 from './Page3'
import Page4 from './Page4'
import dynamic from 'next/dynamic'

function CooldownModal() {
  const toast = useToast()
  const tx = useAtomValue(cooldownTxAtom)

  const stateMachine = useRef(cooldownMachine)
  const [state, send] = useMachine(stateMachine.current, {
    context: {
      hash: tx.hash,
    },
  })

  const currentPage = pageFor(state.value)

  useWatch(send)

  useUnmount(() => {
    if (tx.hash) {
      toast<Required<CooldownTx>>({
        type: ToastType.Cooldown,
        props: {
          hash: tx.hash,
        },
      })
    }
  })

  return (
    <>
      {currentPage === 1 && <Page2 send={send} />}
      {currentPage === 2 && <Page3 />}
      {currentPage === 3 && <Page4 />}
    </>
  )
}

export default dynamic(() => Promise.resolve(CooldownModal), { ssr: false })
