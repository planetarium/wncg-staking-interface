import { useMachine } from '@xstate/react'
import { useAtomValue } from 'jotai'
import dynamic from 'next/dynamic'
import { useRef } from 'react'
import { useUnmount } from 'react-use'

import { ToastType } from 'config/constants'
import { useToast } from 'hooks'
import { useExitForm } from 'hooks/balancer'
import { exitTxAtom } from 'states/tx'
import { exitMachine, pageFor } from './stateMachine'
import { useWatch } from './useWatch'

import Page1 from './Page1'
import Page2 from './Page2'
import Page3 from './Page3'

function ExitModal() {
  const toast = useToast()
  const exitFormReturns = useExitForm()
  const {
    useNative: _isNative,
    assets: _assets,
    amountIn: _amountIn,
    totalExitFiatValue: _totalExitFiatValue,
  } = exitFormReturns

  const tx = useAtomValue(exitTxAtom)

  const isNative = tx.isNative ?? _isNative
  const amountIn = tx.amountIn ?? _amountIn
  const totalExitFiatValue = tx.totalExitFiatValue ?? _totalExitFiatValue

  const stateMachine = useRef(exitMachine)
  const [state, send] = useMachine(stateMachine.current, {
    context: {
      hash: tx.hash,
    },
  })

  const currentPage = pageFor(state.value)

  useWatch(send)

  useUnmount(() => {
    if (tx.hash) {
      toast<ExitTx>({
        type: ToastType.Exit,
        props: {
          hash: tx.hash,
          amountIn,
          isNative,
          totalExitFiatValue,
        },
      })
    }
  })

  return (
    <>
      {currentPage === 1 && (
        <Page1 {...exitFormReturns} send={send} hash={tx.hash} />
      )}

      {currentPage === 2 && <Page2 isNative={isNative} />}
      {currentPage === 3 && <Page3 />}
    </>
  )
}

export default dynamic(() => Promise.resolve(ExitModal), {
  ssr: false,
})
