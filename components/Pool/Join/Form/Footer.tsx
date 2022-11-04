import { MouseEvent, useMemo } from 'react'
import type { FieldErrorsImpl } from 'react-hook-form'
import clsx from 'clsx'

import { ModalCategory } from 'states/ui'
import { HIGH_PRICE_IMPACT, REKT_PRICE_IMPACT } from 'constants/poolLiquidity'
import { configService } from 'services/config'
import { bnum } from 'utils/num'
import { renderStrong } from 'utils/numberFormat'
import { useAllowances, useModal } from 'hooks'
import type { JoinFormFields } from './useJoinForm'

import { StyledJoinFormFooter } from './styled'
import Button from 'components/Button'
import NumberFormat from 'components/NumberFormat'
import SvgIcon from 'components/SvgIcon'

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
  const { allowanceFor } = useAllowances()
  const { addModal } = useModal()

  const tokensToApprove = useMemo(() => {
    return assets.flatMap((address, i) => {
      if (address === configService.nativeAssetAddress) return []
      if (bnum(amounts[i]).isZero()) return []
      if (allowanceFor(address, configService.vaultAddress)) return []
      return [address]
    })
  }, [allowanceFor, amounts, assets])

  const submitDisabled = useMemo(
    () =>
      amounts.every((amount) => bnum(amount).isZero()) ||
      Object.keys(errors).length > 0 ||
      priceImpact >= REKT_PRICE_IMPACT ||
      (priceImpact >= HIGH_PRICE_IMPACT && !priceImpactAgreement),
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
        tokensToApprove,
      },
    })
  }

  const enabled = bnum(totalValue).gt(0)

  return (
    <StyledJoinFormFooter className="joinFormFooter">
      <output className="checkout">
        <span className="text">join pool</span>
        <div className={clsx('value', { enabled })}>
          <SvgIcon icon="approximate" $size={24} />
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
