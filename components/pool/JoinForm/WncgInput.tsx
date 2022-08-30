import { memo, MouseEvent, useMemo } from 'react'
import type { Control, FieldValues, UseFormClearErrors } from 'react-hook-form'

import Decimal, { sanitizeNumber } from 'utils/num'
import type { JoinFormFields } from './type'

import { TokenInput } from '../TokenInput'

type WncgInputProps = {
  balance: string
  clearErrors: UseFormClearErrors<JoinFormFields>
  control: Control<JoinFormFields>
  showPropButton: boolean
  setMaxValue(e: MouseEvent<HTMLButtonElement>): void
  setPropAmount(e: MouseEvent<HTMLButtonElement>): void
  value: string
  error?: string
}

function WncgInput({
  balance,
  clearErrors,
  control,
  showPropButton,
  setMaxValue,
  setPropAmount,
  value,
  error,
}: WncgInputProps) {
  const rules = useMemo(
    () => ({
      validate: {
        maxAmount(v: string) {
          return (
            new Decimal(sanitizeNumber(v)).lte(balance) ||
            'Exceeds wallet balance'
          )
        },
      },
      onChange() {
        clearErrors('wncgAmount')
      },
    }),
    [clearErrors, balance]
  )

  const maximized = useMemo(
    () => new Decimal(value).eq(balance),
    [balance, value]
  )

  return (
    <TokenInput
      id="wncgAmount"
      name="wncgAmount"
      control={control as any as Control<FieldValues, 'any'>}
      rules={rules}
      error={error}
      balance={balance}
      maximized={maximized}
      token="wncg"
      setMaxValue={setMaxValue}
      setPropAmount={setPropAmount}
      propButton={showPropButton}
    />
  )
}

export default memo(WncgInput)
