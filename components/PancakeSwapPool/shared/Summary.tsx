import { memo } from 'react'
import {
  UseFormSetValue,
  UseFormStateReturn,
  UseFormWatch,
} from 'react-hook-form'
import clsx from 'clsx'

import { REKT_PRICE_IMPACT } from 'config/constants/liquidityPool'
import { bnum } from 'utils/bnum'
import { useAuth } from 'hooks'
import { AddLiquidityForm } from 'hooks/pancakeswap/useAddLiquidityForm'

import { StyledAddLiquidityFormSummary } from './styled'
import NumberFormat from 'components/NumberFormat'

type AddLiquidityFormSummaryProps = {
  amountsInFiatValueSum: string
  setValue: UseFormSetValue<AddLiquidityForm>
  formState: UseFormStateReturn<AddLiquidityForm>
  watch: UseFormWatch<AddLiquidityForm>
  disabled?: boolean
}

function AddLiquidityFormSummary({
  amountsInFiatValueSum,
  setValue,
  watch,
  formState,
  disabled = false,
}: AddLiquidityFormSummaryProps) {
  const { isConnected } = useAuth()

  const hasErrors = Object.keys(formState.errors).length > 0

  return (
    <StyledAddLiquidityFormSummary
      className="joinFormSummary"
      $disabled={!isConnected}
    >
      <div className="summaryItem">
        <dt>Total</dt>
        <dd>
          <NumberFormat value={amountsInFiatValueSum} type="fiat" />
        </dd>
      </div>
    </StyledAddLiquidityFormSummary>
  )
}

export default memo(AddLiquidityFormSummary)
