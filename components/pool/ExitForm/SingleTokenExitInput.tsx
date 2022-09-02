import { memo, MouseEvent, useMemo } from 'react'
import type { Control, FieldValues, UseFormClearErrors } from 'react-hook-form'

import { bnum } from 'utils/num'
import type { ExitFormFields } from './type'

import { TokenInput } from '../TokenInput'
import { usePool } from 'hooks'

type SingleTokenExitInputProps = {
  clearErrors: UseFormClearErrors<ExitFormFields>
  control: Control<ExitFormFields>
  singleAssetsMaxes: string[]
  setMaxValue(e: MouseEvent<HTMLButtonElement>): void
  tokenOutIndex: number
  value: string
  error?: string
}

function SingleTokenExitInput({
  clearErrors,
  control,
  singleAssetsMaxes,
  setMaxValue,
  tokenOutIndex,
  value,
  error,
}: SingleTokenExitInputProps) {
  const { poolTokenAddresses } = usePool()
  const max = singleAssetsMaxes[tokenOutIndex]

  const rules = useMemo(
    () => ({
      validate: {
        maxAmount(v: string) {
          return bnum(v).lte(max) || 'Exceeds pool balance for this token'
        },
      },
      onChange() {
        clearErrors('exitAmount')
      },
    }),
    [max, clearErrors]
  )

  const maximized = useMemo(() => bnum(value).eq(max), [max, value])
  const address = poolTokenAddresses[tokenOutIndex]

  return (
    <>
      <TokenInput
        id="singleTokenExit"
        name="exitAmount"
        control={control as any as Control<FieldValues, 'any'>}
        rules={rules}
        action="exit"
        address={address}
        max={max}
        maximized={maximized}
        setMaxValue={setMaxValue}
        error={error}
      />
    </>
  )
}

export default memo(SingleTokenExitInput)
