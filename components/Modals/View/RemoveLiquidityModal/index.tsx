import { useRef } from 'react'
import { useUnmount } from 'react-use'
import { useMachine } from '@xstate/react'
import { useAtomValue, useSetAtom } from 'jotai'

import { slippageAtom } from 'states/system'
import { removeLiquidityTxAtom } from 'states/tx'
import { ToastType } from 'config/constants'
import { useRefetch, useToast } from 'hooks'
import { useRemoveLiquidityForm } from 'hooks/pancakeswap'
import { removeLiquidityMachine, pageFor } from './stateMachine'
import { useWatch } from './useWatch'

import Page1 from './Page1'
import Page2 from './Page2'
import Page3 from './Page3'

function RemoveLiquidityModal() {
  const toast = useToast()
  const removeLiquidityFormReturns = useRemoveLiquidityForm()
  const {
    assets: _assets,
    amountsOut: _amountsOut,
    amountsOutFiatValueSum: _amountsOutFiatValueSum,
    isNative: _isNative,
    pcntOut: _pcntOut,
    lpAmountOut: _lpAmountOut,
  } = removeLiquidityFormReturns

  const refetch = useRefetch({
    userAllowances: true,
    userBalances: true,
  })

  const setSlippage = useSetAtom(slippageAtom)
  const tx = useAtomValue(removeLiquidityTxAtom)

  const hash = tx.hash
  const assets = tx.assets ?? _assets
  const amountsOut = tx.amountsOut ?? _amountsOut
  const amountsOutFiatValueSum =
    tx.amountsOutFiatValueSum ?? _amountsOutFiatValueSum
  const isNative = tx.isNative ?? _isNative
  const pcntOut = tx.pcntOut ?? _pcntOut
  const lpAmountOut = tx.lpAmountOut ?? _lpAmountOut

  const stateMachine = useRef(removeLiquidityMachine)
  const [state, send] = useMachine(stateMachine.current, {
    context: {
      hash: tx.hash,
    },
  })

  const currentPage = pageFor(state.value)

  useWatch(send)

  useUnmount(() => {
    refetch()
    setSlippage(null)

    if (hash) {
      toast<RemoveLiquidityTx>({
        type: ToastType.RemoveLiquidity,
        props: {
          assets,
          hash,
          amountsOut,
          amountsOutFiatValueSum,
          isNative,
          pcntOut,
          lpAmountOut,
        },
      })
    }
  })

  return (
    <>
      {currentPage === 1 && (
        <Page1
          {...removeLiquidityFormReturns}
          send={send}
          assets={assets}
          amountsOut={amountsOut}
          amountsOutFiatValueSum={amountsOutFiatValueSum}
          isNative={isNative}
          pcntOut={pcntOut}
          lpAmountOut={lpAmountOut}
        />
      )}
      {currentPage === 2 && <Page2 assets={assets} />}
      {currentPage === 3 && <Page3 />}
    </>
  )
}

export default RemoveLiquidityModal
