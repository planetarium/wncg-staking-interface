import {
  UseFormSetValue,
  UseFormStateReturn,
  UseFormWatch,
} from 'react-hook-form'
import clsx from 'clsx'

import { LiquidityFieldType } from 'config/constants'
import { REKT_PRICE_IMPACT } from 'config/constants/liquidityPool'
import { bnum } from 'utils/bnum'
import { useAuth } from 'hooks'
import { JoinPoolForm } from 'hooks/balancer/useJoinForm'

import { StyledJoinFormSummary } from './styled'
import HighPriceImpact from 'components/HighPriceImpact'
import NumberFormat from 'components/NumberFormat'
import RektPriceImpact from 'components/RektPriceImpact'
import { useMemo } from 'react'

type JoinFormSummaryProps = {
  priceImpact: string
  totalJoinFiatValue: string
  setValue: UseFormSetValue<JoinPoolForm>
  formState: UseFormStateReturn<JoinPoolForm>
  watch: UseFormWatch<JoinPoolForm>
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
  const priceImpactInPcnt = bnum(priceImpact).times(100).toFixed(4)

  const alert = bnum(priceImpact).gte(REKT_PRICE_IMPACT)

  const priceImpactAgreement = watch(LiquidityFieldType.HighPriceImpact)

  function toggle() {
    setValue(LiquidityFieldType.HighPriceImpact, !priceImpactAgreement)
  }

  const hasErrors = useMemo(
    () => Object.keys(formState.errors).length > 0,
    [formState.errors]
  )

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
          <NumberFormat
            value={priceImpactInPcnt}
            type="percent"
            roundingMode={4}
          />
        </dd>
      </div>

      <HighPriceImpact
        className="priceImpactAlert"
        checked={priceImpactAgreement}
        priceImpact={priceImpact}
        toggle={toggle}
        disabled={disabled || hasErrors}
      />

      <RektPriceImpact
        className="priceImpactAlert"
        action="join"
        priceImpact={priceImpact}
      />
    </StyledJoinFormSummary>
  )
}

export default JoinFormSummary
