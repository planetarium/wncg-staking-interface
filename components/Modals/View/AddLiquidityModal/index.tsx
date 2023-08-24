import { useRef } from 'react'
import { useUnmount } from 'react-use'
import dynamic from 'next/dynamic'
import { useMachine } from '@xstate/react'
import { useAtomValue } from 'jotai'

import { addLiquidityTxAtom } from 'states/tx'
import { ToastType } from 'config/constants'
import { useToast } from 'hooks'
import { addLiquidityMachine, pageFor } from './stateMachine'
import { useWatch } from './useWatch'

import Page1 from './Page1'
import Page2 from './Page2'
import Page3 from './Page3'

type AddLiquidityModalProps = Required<AddLiquidityTx> & {
  resetForm(): void
}

function AddLiquidityModal({
  assets: _assets,
  amountsIn: _amountsIn,
  userLpAmount: _userLpAmount,
  amountsInFiatValueSum: _amountsInFiatValueSum,
  resetForm,
}: AddLiquidityModalProps) {
  const toast = useToast()
  const tx = useAtomValue(addLiquidityTxAtom)

  const hash = tx.hash
  const assets = tx.assets ?? _assets
  const amountsIn = tx.amountsIn ?? _amountsIn
  const userLpAmount = tx.userLpAmount ?? _userLpAmount
  const amountsInFiatValueSum =
    tx.amountsInFiatValueSum ?? _amountsInFiatValueSum

  const stateMachine = useRef(addLiquidityMachine)
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
      toast<Required<AddLiquidityTx>>({
        type: ToastType.AddLiquidity,
        props: {
          hash,
          assets,
          amountsIn,
          userLpAmount,
          amountsInFiatValueSum,
        },
      })
    }
  })

  return (
    <>
      {currentPage === 1 && (
        <Page1
          assets={assets}
          amountsIn={amountsIn}
          userLpAmount={userLpAmount}
          send={send}
          amountsInFiatValueSum={amountsInFiatValueSum}
        />
      )}
      {currentPage === 2 && <Page2 />}
      {currentPage === 3 && <Page3 />}
    </>
  )
}

export default dynamic(() => Promise.resolve(AddLiquidityModal), { ssr: false })
