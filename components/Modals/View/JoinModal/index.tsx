import { useRef } from 'react'
import { useUnmount } from 'react-use'
import { useMachine } from '@xstate/react'
import { useAtomValue } from 'jotai'

import { joinTxAtom } from 'states/tx'
import { ToastType } from 'config/constants'
import { useToast } from 'hooks'
import { joinMachine, pageFor } from './stateMachine'
import { useWatch } from './useWatch'

import Page1 from './Page1'
import Page2 from './Page2'
import Page3 from './Page3'

type JoinModalProps = Required<JoinTx> & {
  resetForm(): void
}

function JoinModal({
  assets: _assets,
  joinAmounts: _joinAmounts,
  lpBalance: _lpBalance,
  totalJoinFiatValue: _totalJoinFiatValue,
  resetForm,
}: JoinModalProps) {
  const toast = useToast()
  const tx = useAtomValue(joinTxAtom)

  const hash = tx.hash
  const assets = tx.assets ?? _assets
  const joinAmounts = tx.joinAmounts ?? _joinAmounts
  const lpBalance = tx.lpBalance ?? _lpBalance
  const totalJoinFiatValue = tx.totalJoinFiatValue ?? _totalJoinFiatValue

  const stateMachine = useRef(joinMachine)
  const [state, send] = useMachine(stateMachine.current, {
    context: {
      hash,
    },
  })

  const currentPage = pageFor(state.value)

  useWatch(send)

  useUnmount(() => {
    resetForm()

    if (hash) {
      toast<Required<JoinTx>>({
        type: ToastType.Join,
        props: {
          hash,
          assets,
          joinAmounts,
          lpBalance: lpBalance,
          totalJoinFiatValue,
        },
      })
    }
  })

  return (
    <>
      {currentPage === 1 && (
        <Page1
          assets={assets}
          joinAmounts={joinAmounts}
          lpBalance={lpBalance}
          send={send}
          totalJoinFiatValue={totalJoinFiatValue}
        />
      )}
      {currentPage === 2 && <Page2 />}
      {currentPage === 3 && <Page3 />}
    </>
  )
}

export default JoinModal
