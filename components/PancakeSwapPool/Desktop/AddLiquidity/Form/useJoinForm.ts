import { useCallback, useMemo, useState } from 'react'
import {
  Control,
  useForm,
  UseFormClearErrors,
  UseFormSetValue,
  UseFormStateReturn,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form'

import { LiquidityFieldType } from 'config/constants'
import { bnum } from 'utils/bnum'
import { useFiat, usePair } from 'hooks'
import { useJoinMath } from './useJoinMath'

const fields: LiquidityFieldType[] = [
  LiquidityFieldType.TokenA,
  LiquidityFieldType.TokenB,
]

const defaultValues = {
  [LiquidityFieldType.TokenA]: '',
  [LiquidityFieldType.TokenB]: '',
}

export type AddLiquidityFormFields = {
  [LiquidityFieldType.TokenA]: string
  [LiquidityFieldType.TokenB]: string
}

export type AddLiquidityFormElements = 'Optimize' | 'Max' | 'Input'

export type UseAddLiquidityFormReturns = {
  activeField: 'TokenA' | 'TokenB' | null
  clearErrors: UseFormClearErrors<AddLiquidityFormFields>
  control: Control<AddLiquidityFormFields>
  fields: LiquidityFieldType[]
  focused: AddLiquidityFormElements | null
  formState: UseFormStateReturn<AddLiquidityFormFields>
  isOptimized: boolean
  joinAmounts: string[]
  joinAmountsInFiatValue: string[]
  optimize(): void
  resetFields(): void
  setActiveField(field: 'TokenA' | 'TokenB' | null): void
  setFocused(value: AddLiquidityFormElements | null): void
  setValue: UseFormSetValue<AddLiquidityFormFields>
  submitDisabled: boolean
  totalJoinFiatValue: string
  trigger: UseFormTrigger<AddLiquidityFormFields>
  watch: UseFormWatch<AddLiquidityFormFields>
}

export function useAddLiquidityForm(): UseAddLiquidityFormReturns {
  const [focused, setFocused] = useState<AddLiquidityFormElements | null>(null)
  const [activeField, setActiveField] = useState<'TokenA' | 'TokenB' | null>(
    null
  )

  const toFiat = useFiat()
  const { optimizedAmounts } = useJoinMath()
  const { pairTokenAddresses } = usePair()

  const { clearErrors, control, formState, reset, trigger, setValue, watch } =
    useForm<AddLiquidityFormFields>({
      mode: 'onChange',
      defaultValues,
    })

  const resetFields = useCallback(() => {
    reset(defaultValues)
  }, [reset])

  const joinAmounts = fields.map((field) =>
    bnum(watch(field as any)).toString()
  ) as string[]

  const joinAmountsInFiatValue = joinAmounts.map((amount, i) =>
    toFiat(amount, pairTokenAddresses[i])
  )

  const isOptimized = useMemo(() => {
    return joinAmounts.every((amount, i) =>
      bnum(amount).eq(optimizedAmounts[i])
    )
  }, [joinAmounts, optimizedAmounts])

  const optimize = useCallback(() => {
    fields.forEach((field, i) => {
      let value = optimizedAmounts[i]
      if (value === '') value = '0'

      setValue(field as 'TokenA' | 'TokenB', value)
    })

    setFocused('Optimize')

    trigger()
  }, [optimizedAmounts, setValue, trigger])

  const totalJoinFiatValue = useMemo(
    () =>
      joinAmountsInFiatValue
        .reduce((acc, fiatValue) => acc.plus(fiatValue), bnum(0))
        .toString(),
    [joinAmountsInFiatValue]
  )

  const submitDisabled = useMemo(
    () =>
      joinAmounts.every((amount) => bnum(amount).isZero()) ||
      Object.values(formState.errors).length > 0,
    [formState, joinAmounts]
  )

  return {
    activeField,
    clearErrors,
    control,
    fields,
    focused,
    formState,
    isOptimized,
    joinAmounts,
    joinAmountsInFiatValue,
    optimize,
    resetFields,
    setActiveField,
    setFocused,
    setValue,
    submitDisabled,
    totalJoinFiatValue,
    trigger,
    watch,
  }
}
