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
    exitType: _exitType,
    assets: _assets,
    bptIn: _bptIn,
    amountOut: _amountOut,
    bptOutInFiatValue: _bptOutInFiatValue,
    tokenOutIndex: _tokenOutIndex,
  } = exitFormReturns

  const tx = useAtomValue(exitTxAtom)

  const exitType = tx.exitType ?? _exitType
  const bptIn = tx.bptIn ?? _bptIn
  const amountOut = tx.amountOut ?? _amountOut
  const tokenOutIndex = tx.tokenOutIndex ?? _tokenOutIndex

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
          bptIn,
          amountOut,
          exitType,
          tokenOutIndex,
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
        <Page2 exitType={exitType} assets={[]} tokenOutIndex={tokenOutIndex} />
      )}
      {currentPage === 3 && <Page3 />}
    </>
  )
}

export default dynamic(() => Promise.resolve(ExitModal), {
  ssr: false,
})
