import { MouseEvent, useMemo } from 'react'
import type {
  Control,
  FieldValues,
  FormState,
  UseFormClearErrors,
} from 'react-hook-form'

import Decimal, { sanitizeNumber } from 'utils/num'
import type { InvestFormFields } from './type'

import { TokenInput } from '../TokenInput'

type WncgInputProps = {
  clearErrors: UseFormClearErrors<InvestFormFields>
  control: Control<InvestFormFields>
  formState: FormState<InvestFormFields>
  setMaxValue(e: MouseEvent<HTMLButtonElement>): void
  setPropAmount(e: MouseEvent<HTMLButtonElement>): void
  showPropButton: boolean
  wncgBalance: string
  wncgValue: string
  error?: string
}

export function WncgInput({
  clearErrors,
  control,
  setMaxValue,
  setPropAmount,
  showPropButton,
  wncgBalance,
  wncgValue,
  error,
}: WncgInputProps) {
  const rules = useMemo(
    () => ({
      validate: {
        maxAmount(v: string) {
          return (
            new Decimal(sanitizeNumber(v)).lte(wncgBalance) ||
            'Exceeds wallet balance'
          )
        },
      },
      onChange() {
        clearErrors('wncgAmount')
      },
    }),
    [clearErrors, wncgBalance]
  )

  const maximized = useMemo(
    () => new Decimal(wncgValue).eq(wncgBalance),
    [wncgBalance, wncgValue]
  )

  return (
    <TokenInput
      id="wncgAmount"
      name="wncgAmount"
      control={control as any as Control<FieldValues, 'any'>}
      rules={rules}
      error={error}
      balance={wncgBalance}
      maximized={maximized}
      token="wncg"
      setMaxValue={setMaxValue}
      setPropAmount={setPropAmount}
      propButton={showPropButton}
    />
  )
}
