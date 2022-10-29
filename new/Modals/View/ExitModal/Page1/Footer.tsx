import { memo, useMemo } from 'react'
import clsx from 'clsx'

import { HIGH_PRICE_IMPACT, REKT_PRICE_IMPACT } from 'constants/poolLiquidity'
import { bnum } from 'utils/num'
import { renderStrong } from 'utils/numberFormat'

import { StyledExitModalPage1Footer } from './styled'
import Button from 'new/Button'
import NumberFormat from 'new/NumberFormat'
import SvgIcon from 'new/SvgIcon'

type ExitModalPage1FooterProps = {
  bptIn: string
  exitType: string
  errors: any
  priceImpact: number
  priceImpactAgreement: boolean
  send(value: string): void
  tokenOutAmount: string
  totalValue: string
}

function ExitModalPage1Footer({
  exitType,
  errors,
  priceImpact,
  priceImpactAgreement,
  send,
  tokenOutAmount,
  totalValue,
}: ExitModalPage1FooterProps) {
  const submitDisabled = useMemo(
    () =>
      (exitType !== 'all' && bnum(tokenOutAmount).isZero()) ||
      Object.keys(errors).length > 0 ||
      priceImpact >= REKT_PRICE_IMPACT ||
      (priceImpact >= HIGH_PRICE_IMPACT && !priceImpactAgreement),
    [errors, exitType, priceImpact, priceImpactAgreement, tokenOutAmount]
  )

  function goNext() {
    if (submitDisabled) return
    send('NEXT')
  }

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
      <Button disabled={submitDisabled} onClick={goNext} $size="lg">
        Exit pool
      </Button>
    </StyledExitModalPage1Footer>
  )
}

export default memo(ExitModalPage1Footer)
