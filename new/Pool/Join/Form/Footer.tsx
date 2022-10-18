import { useMemo } from 'react'
import type { MouseEvent } from 'react'
import type { FieldErrorsImpl } from 'react-hook-form'
import clsx from 'clsx'

import { ModalCategory } from 'states/ui'
import { HIGH_PRICE_IMPACT, REKT_PRICE_IMPACT } from 'constants/poolLiquidity'
import { bnum } from 'utils/num'
import { renderStrong } from 'utils/numberFormat'
import { useModal } from 'hooks'
import type { JoinFormFields } from './useJoinForm'

import { StyledJoinFormFooter } from './styled'
import Button from 'new/Button'
import NumberFormat from 'new/NumberFormat'
import SvgIcon from 'new/SvgIcon'

type JoinFormFooterProps = {
  amounts: string[]
  assets: string[]
  priceImpact: number
  priceImpactAgreement: boolean
  totalValue: string
  errors: Partial<FieldErrorsImpl<JoinFormFields>>
  resetForm(): void
}

function JoinFormFooter({
  amounts,
  assets,
  priceImpact,
  priceImpactAgreement,
  totalValue,
  errors,
  resetForm,
}: JoinFormFooterProps) {
  const { addModal } = useModal()

  const submitDisabled = useMemo(
    () =>
      amounts.every((amount) => bnum(amount).isZero()) ||
      Object.keys(errors).length > 0 ||
      priceImpact > REKT_PRICE_IMPACT ||
      (priceImpact > HIGH_PRICE_IMPACT && !priceImpactAgreement),
    [amounts, errors, priceImpact, priceImpactAgreement]
  )

  function handleJoin(e: MouseEvent) {
    e.preventDefault()

    addModal({
      category: ModalCategory.Join,
      props: {
        amounts,
        assets,
        resetForm,
      },
    })
  }

  const enabled = bnum(totalValue).gt(0)

  return (
    <StyledJoinFormFooter className="joinFormFooter">
      <output className="checkout">
        <span className="text">join pool</span>
        <div className={clsx('value', { enabled })}>
          <SvgIcon icon="approximate" />
          <NumberFormat
            value={totalValue}
            prefix="$"
            renderText={renderStrong}
          />
        </div>
      </output>

      <Button
        className="actionButton"
        type="submit"
        onClick={handleJoin}
        disabled={submitDisabled}
        $size="lg"
      >
        Join pool, Get LP Tokens
      </Button>
    </StyledJoinFormFooter>
  )
}

export default JoinFormFooter
