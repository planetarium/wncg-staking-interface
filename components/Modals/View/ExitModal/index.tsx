import { useRef } from 'react'
import { useUnmount } from 'react-use'
import { useMachine } from '@xstate/react'
import dynamic from 'next/dynamic'
import { useAtomValue } from 'jotai'

import { exitTxAtom } from 'states/tx'
import { ToastType } from 'config/constants'
import { useToast } from 'hooks'
import { useExitForm } from 'hooks/balancer'
import { exitMachine, pageFor } from './stateMachine'
import { useWatch } from './useWatch'

import Page1 from './Page1'
import Page2 from './Page2'
import Page3 from './Page3'

function ExitModal() {
  const toast = useToast()
  const exitFormReturns = useExitForm()
  const {
    assets: _assets,
    bptIn: _bptIn,
    exitAmounts: _exitAmounts,
    exitAmountInFiatValue: _exitAmountInFiatValue,
    totalExitFiatValue: _totalExitFiatValue,
    isPropExit: _isPropExit,
    singleExitTokenOutIndex,
  } = exitFormReturns

  const tx = useAtomValue(exitTxAtom)

  const assets = tx.assets ?? _assets
  const bptIn = tx.bptIn ?? _bptIn
  const exitAmounts = tx.exitAmounts ?? _exitAmounts
  const isPropExit = tx.isPropExit ?? _isPropExit
  const totalExitFiatValue = tx.totalExitFiatValue ?? _totalExitFiatValue
  const tokenOutIndex = tx.tokenOutIndex ?? singleExitTokenOutIndex

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
          assets,
          exitAmounts,
          totalExitFiatValue,
          tokenOutIndex,
          bptIn,
          isPropExit,
        },
      })
    }
  })

  return (
    <>
      {currentPage === 1 && (
        <Page1 {...exitFormReturns} send={send} hash={tx.hash} />
      )}
      {currentPage === 2 && (
        <Page2
          isPropExit={isPropExit}
          assets={assets}
          tokenOutIndex={tokenOutIndex}
        />
      )}
      {currentPage === 3 && <Page3 />}
    </>
  )
}

export default dynamic(() => Promise.resolve(ExitModal), {
  ssr: false,
})
