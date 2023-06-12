import { memo } from 'react'
import {
  UseFormSetValue,
  UseFormStateReturn,
  UseFormWatch,
} from 'react-hook-form'
import clsx from 'clsx'

import { REKT_PRICE_IMPACT } from 'config/constants/liquidityPool'
import { bnum } from 'utils/bnum'
import { JoinFormFields } from 'hooks/useJoinForm'

import { StyledJoinFormSummary } from './styled'
import HighPriceImpact from 'components/HighPriceImpact'
import NumberFormat from 'components/NumberFormat'
import RektPriceImpact from 'components/RektPriceImpact'
import { useAuth } from 'hooks'

type JoinFormSummaryProps = {
  priceImpact: number
  totalJoinFiatValue: string
  setValue: UseFormSetValue<JoinFormFields>
  formState: UseFormStateReturn<JoinFormFields>
  watch: UseFormWatch<JoinFormFields>
  disabled?: boolean
}

function JoinFormSummary({
  priceImpact,
  totalJoinFiatValue,
  setValue,
  watch,
  formState,
  disabled = false,
}: JoinFormSummaryProps) {
  const { isConnected } = useAuth()
  const priceImpactInPcnt = bnum(priceImpact * 100).toFixed(4)
  const alert = priceImpact >= REKT_PRICE_IMPACT

  const priceImpactAgreement = watch('priceImpactAgreement')

  function toggle() {
    setValue('priceImpactAgreement', !priceImpactAgreement)
  }

  const hasErrors = Object.keys(formState.errors).length > 0

  return (
    <StyledJoinFormSummary className="joinFormSummary" $disabled={!isConnected}>
      <div className="summaryItem">
        <dt>Total</dt>
        <dd>
          <NumberFormat value={totalJoinFiatValue} type="fiat" />
        </dd>
      </div>

      <div className="summaryItem">
        <dt>Price impact</dt>
        <dd className={clsx({ alert })}>
          <NumberFormat value={priceImpactInPcnt} type="percent" />
        </dd>
      </div>

      {!hasErrors && (
        <HighPriceImpact
          className="priceImpactAlert"
          checked={priceImpactAgreement}
          priceImpact={priceImpact}
          toggle={toggle}
          disabled={disabled}
        />
      )}

      <RektPriceImpact
        className="priceImpactAlert"
        action="join"
        priceImpact={priceImpact}
      />
    </StyledJoinFormSummary>
  )
}

export default memo(JoinFormSummary)
