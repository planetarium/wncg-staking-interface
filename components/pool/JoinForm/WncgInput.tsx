import { memo, MouseEvent, useMemo } from 'react'
import type { Control, FieldValues, UseFormClearErrors } from 'react-hook-form'

import { getWncgBalance } from 'app/states/balance'
import Decimal, { sanitizeNumber } from 'utils/num'
import { useAppSelector } from 'hooks'
import type { JoinFormFields } from './type'

import { TokenInput } from '../TokenInput'

type WncgInputProps = {
  clearErrors: UseFormClearErrors<JoinFormFields>
  control: Control<JoinFormFields>
  showPropButton: boolean
  setMaxValue(e: MouseEvent<HTMLButtonElement>): void
  setPropAmount(e: MouseEvent<HTMLButtonElement>): void
  value: string
  error?: string
}

function WncgInput({
  clearErrors,
  control,
  showPropButton,
  setMaxValue,
  setPropAmount,
  value,
  error,
}: WncgInputProps) {
  const wncgBalance = useAppSelector(getWncgBalance)

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
    () => new Decimal(value).eq(wncgBalance),
    [wncgBalance, value]
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

export default memo(WncgInput)
