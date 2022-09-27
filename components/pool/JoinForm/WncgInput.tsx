import { memo, MouseEvent, useEffect, useMemo } from 'react'
import type {
  Control,
  FieldValues,
  UseFormClearErrors,
  UseFormTrigger,
} from 'react-hook-form'

import { bnum } from 'utils/num'
import type { JoinFormFields } from './type'

import { TokenInput } from '../TokenInput'

type WncgInputProps = {
  address: string
  balance: string
  clearErrors: UseFormClearErrors<JoinFormFields>
  control: Control<JoinFormFields>
  maximized: boolean
  showPropButton: boolean
  setMaxValue(e: MouseEvent<HTMLButtonElement>): void
  setPropAmount(e: MouseEvent<HTMLButtonElement>): void
  trigger: UseFormTrigger<JoinFormFields>
  error?: string
  fiatValue?: number
}

function WncgInput({
  address,
  balance,
  clearErrors,
  control,
  maximized,
  showPropButton,
  setMaxValue,
  setPropAmount,
  trigger,
  error,
  fiatValue,
}: WncgInputProps) {
  const rules = useMemo(
    () => ({
      validate: {
        maxAmount(v: string) {
          const bValue = bnum(v)
          if (bValue.isNaN()) return true
          return bValue.lte(balance) || 'Exceeds wallet balance'
        },
      },
      onChange() {
        clearErrors('wncgAmount')
      },
    }),
    [clearErrors, balance]
  )

  useEffect(() => {
    trigger('wncgAmount')
  }, [balance, trigger])

  return (
    <TokenInput
      id="wncgAmount"
      name="wncgAmount"
      control={control as any as Control<FieldValues, 'any'>}
      rules={rules}
      action="join"
      address={address}
      error={error}
      fiatValue={fiatValue}
      max={balance}
      maximized={maximized}
      setMaxValue={setMaxValue}
      setPropAmount={setPropAmount}
      showLabel
      propButton={showPropButton}
    />
  )
}

export default memo(WncgInput)
