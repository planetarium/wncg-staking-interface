import { memo, useMemo } from 'react'
import type { StateValue } from 'xstate'
import { useSetAtom } from 'jotai'
import clsx from 'clsx'

import { pendingExitTxAtom } from 'states/form'
import { HIGH_PRICE_IMPACT, REKT_PRICE_IMPACT } from 'constants/poolLiquidity'
import { bnum } from 'utils/num'
import { renderStrong } from 'utils/numberFormat'
import { useExit } from '../useExit'

import { StyledExitModalPage1Footer } from './styled'
import NumberFormat from 'new/NumberFormat'
import SvgIcon from 'new/SvgIcon'
import TxButton from 'new/TxButton'

type ExitModalPage1FooterProps = {
  assets: string[]
  bptIn: string
  bptOutPcnt: number
  currentState: StateValue
  errors: any
  exactOut: boolean
  exitAmounts: string[]
  exitType: string
  isProportional: boolean
  priceImpact: number
  priceImpactAgreement: boolean
  send(value: string): void
  tokenOutAmount: string
  totalValue: string
}

function ExitModalPage1Footer({
  assets,
  bptIn,
  bptOutPcnt,
  currentState,
  errors,
  exactOut,
  exitAmounts,
  exitType,
  isProportional,
  priceImpact,
  priceImpactAgreement,
  send,
  tokenOutAmount,
  totalValue,
}: ExitModalPage1FooterProps) {
  const setPendingTx = useSetAtom(pendingExitTxAtom)

  const exitPool = useExit(
    exitAmounts,
    assets,
    bptIn,
    exactOut,
    isProportional,
    {
      onConfirm(txHash?: Hash) {
        setPendingTx({
          bptOutPcnt,
          exitType,
          hash: txHash,
          tokenOutAmount,
        })
        send('CALL')
      },
      onError(error) {
        if (error?.code === 'ACTION_REJECTED') return
        if (error?.code === 4001) return
        send('FAIL')
      },
    }
  )

  const submitDisabled = useMemo(
    () =>
      (exitType !== 'all' && bnum(tokenOutAmount).isZero()) ||
      Object.keys(errors).length > 0 ||
      priceImpact >= REKT_PRICE_IMPACT ||
      (priceImpact >= HIGH_PRICE_IMPACT && !priceImpactAgreement),
    [errors, exitType, priceImpact, priceImpactAgreement, tokenOutAmount]
  )

  const enabled = bnum(totalValue).gt(0)

  return (
    <StyledExitModalPage1Footer className="exitModalFooter">
      <output className="checkout">
        <span className="text">you can get</span>
        <div className={clsx('value', { enabled })}>
          <SvgIcon icon="approximate" />
          <NumberFormat
            value={totalValue}
            prefix="$"
            renderText={renderStrong}
          />
        </div>
      </output>

      <TxButton
        onClick={exitPool}
        isPending={currentState === 'exitPending'}
        disabled={submitDisabled}
        $size="lg"
      >
        Exit pool
      </TxButton>
    </StyledExitModalPage1Footer>
  )
}

export default memo(ExitModalPage1Footer)
