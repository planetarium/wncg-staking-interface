import { useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useAtom, useSetAtom } from 'jotai'
import { AnimatePresence } from 'framer-motion'

import { removeLiquidityTxAtom } from 'states/tx'
import { walletErrorHandler } from 'utils/walletErrorHandler'
import { useRemoveLiquidity } from 'hooks/pancakeswap'
import type { UseRemoveLiquidityFormReturns } from 'hooks/pancakeswap/useRemoveLiquidityForm'
import { removeLiquidityErrorAtom } from '../useWatch'

import { StyledRemoveLiquidityModalPage1 } from './styled'
import { Checkout, CloseButton, PendingNotice } from 'components/Modals/shared'
import SlippageControl from 'components/SlippageControl'
import TxButton from 'components/TxButton'
import Form from './Form'
import Signature from './Signature'

const Timer = dynamic(() => import('./Timer'), {
  ssr: false,
})

type RemoveLiquidityModalPage1Props = {
  send: XstateSend
} & UseRemoveLiquidityFormReturns

function RemoveLiquidityModalPage1({
  send,
  ...props
}: RemoveLiquidityModalPage1Props) {
  const [tx, setTx] = useAtom(removeLiquidityTxAtom)
  const setError = useSetAtom(removeLiquidityErrorAtom)

  const {
    amountsOut,
    amountsOutFiatValueSum,
    isNative,
    lpAmountOut,
    signature,
    submitDisabled,
    pcntOut,
    setValue,
  } = props

  const { removeLiquidity, error } = useRemoveLiquidity(
    amountsOut,
    lpAmountOut,
    isNative,
    signature!
  )

  const onClickRemoveLiquidity = useCallback(async () => {
    try {
      if (error) {
        throw Error(error)
      }

      const txHash = await removeLiquidity?.()
      if (!txHash) throw Error('No txHash')

      setTx({
        hash: txHash,
        amountsOut,
        amountsOutFiatValueSum,
        pcntOut,
        isNative,
        lpAmountOut,
      })

      send('NEXT')
    } catch (error: any) {
      walletErrorHandler(error, () => {
        setError(error)
        send('FAIL')
      })
      send('ROLLBACK')
    }
  }, [
    amountsOut,
    amountsOutFiatValueSum,
    error,
    isNative,
    lpAmountOut,
    pcntOut,
    removeLiquidity,
    send,
    setError,
    setTx,
  ])

  const disabled = !!tx.hash
  const showTimer = (signature?.deadline ?? 0) > 0 && !disabled

  return (
    <StyledRemoveLiquidityModalPage1 $disabled={disabled}>
      <header className="modalHeader">
        <div className="titleGroup">
          <h2 className="subtitle">Exit pool</h2>
        </div>
        <SlippageControl disabled={disabled} />
        <CloseButton />
      </header>

      <div className="container">
        <div className="modalContent">
          <Form {...props} />
          <Signature
            lpAmountOut={lpAmountOut}
            signature={signature}
            setValue={setValue}
          />
        </div>
      </div>

      <footer className="modalFooter">
        <Checkout
          message="You can get"
          amount={amountsOutFiatValueSum}
          type="fiat"
        />

        <TxButton
          onClick={onClickRemoveLiquidity}
          disabled={disabled || submitDisabled}
        >
          Exit pool
        </TxButton>

        <AnimatePresence>
          {showTimer && (
            <Timer deadline={signature?.deadline!} setValue={setValue} />
          )}
        </AnimatePresence>
      </footer>

      <PendingNotice hash={tx.hash} />
    </StyledRemoveLiquidityModalPage1>
  )
}

export default RemoveLiquidityModalPage1
