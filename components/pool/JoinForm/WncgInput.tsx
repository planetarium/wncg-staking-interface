import { memo, MouseEvent, useMemo } from 'react'
import type { Control, FieldValues, UseFormClearErrors } from 'react-hook-form'

import { bnum } from 'utils/num'
import type { JoinFormFields } from './type'

import { TokenInput } from '../TokenInput'

type WncgInputProps = {
  address: string
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
  address,
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
          return bnum(v).lte(balance) || 'Exceeds wallet balance'
        },
      },
      onChange() {
        clearErrors('wncgAmount')
      },
    }),
    [clearErrors, balance]
  )

  const maximized = useMemo(() => bnum(value).eq(balance), [balance, value])

  return (
    <TokenInput
      id="wncgAmount"
      name="wncgAmount"
      control={control as any as Control<FieldValues, 'any'>}
      rules={rules}
      action="join"
      address={address}
      error={error}
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
