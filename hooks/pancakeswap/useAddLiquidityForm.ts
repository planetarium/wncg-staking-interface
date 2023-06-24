import { useCallback, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Control,
  useForm,
  UseFormClearErrors,
  UseFormSetValue,
  UseFormStateReturn,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form'

import { AddLiquidityField } from 'config/constants'
import { QUERY_KEYS } from 'config/constants/queryKeys'
import { bnum } from 'utils/bnum'
import { useAuth, useChain, useFiat, useStaking } from 'hooks'
import { useAddLiquidityMath } from './useAddLiquidityMath'

export type AddLiquidityFormElement = 'Optimize' | 'Max' | 'Input' | null

export type AddLiquidityForm = {
  [AddLiquidityField.TokenA]: string
  [AddLiquidityField.TokenB]: string
  [AddLiquidityField.UseNative]: boolean
}

export const FIELDS = [AddLiquidityField.TokenA, AddLiquidityField.TokenB]

const DEFAULT_VALUES: AddLiquidityForm = {
  [AddLiquidityField.TokenA]: '',
  [AddLiquidityField.TokenB]: '',
  [AddLiquidityField.UseNative]: true,
}

export type UseAddLiquidityFormReturns = {
  activeField: AddLiquidityField | null
  amountsIn: string[]
  amountsInFiatValue: string[]
  assets: Hash[]
  amountsInFiatValueSum: string
  clearErrors: UseFormClearErrors<AddLiquidityForm>
  control: Control<AddLiquidityForm>
  fields: AddLiquidityField[]
  focusedElement: AddLiquidityFormElement
  formState: UseFormStateReturn<AddLiquidityForm>
  isNative: boolean
  optimized: boolean
  optimizeDisabled: boolean
  maxBalances: string[]
  maxSafeBalances: string[]
  optimize(): void
  resetFields(): void
  setActiveField(field: AddLiquidityField | null): void
  setFocusedElement(value: AddLiquidityFormElement): void
  setValue: UseFormSetValue<AddLiquidityForm>
  submitDisabled: boolean
  trigger: UseFormTrigger<AddLiquidityForm>
  watch: UseFormWatch<AddLiquidityForm>
}

export function useAddLiquidityForm(): UseAddLiquidityFormReturns {
  const [focusedElement, setFocusedElement] =
    useState<AddLiquidityFormElement>(null)
  const [activeField, setActiveField] = useState<AddLiquidityField | null>(null)

  const { account, isConnected } = useAuth()
  const { chainId } = useChain()
  const toFiat = useFiat()
  const { poolTokenAddresses } = useStaking()

  const { clearErrors, control, formState, reset, trigger, setValue, watch } =
    useForm<AddLiquidityForm>({
      mode: 'onChange',
      defaultValues: DEFAULT_VALUES,
    })

  const amountsIn = FIELDS.map((f) => bnum(watch(f)).toString())
  const isNative = watch(AddLiquidityField.UseNative)

  const {
    assets,
    maxBalances,
    maxSafeBalances,
    calcPropAmountIn,
    calcOptimizedAmounts,
  } = useAddLiquidityMath(isNative)

  const optimizeDisabled = useMemo(() => {
    return maxBalances.some((amt) => bnum(amt).isZero())
  }, [maxBalances])

  const { data: optAmountsIn = ['0', '0'] } = useQuery(
    [
      QUERY_KEYS.Liquidity.AddLiquidity.OptimizedAmounts,
      chainId,
      account,
      ...maxBalances,
    ],
    calcOptimizedAmounts,
    {
      enabled: !!isConnected,
      staleTime: Infinity,
    }
  )

  const resetFields = useCallback(() => {
    reset(DEFAULT_VALUES)
  }, [reset])

  const amountsInFiatValue = amountsIn.map((amount, i) =>
    toFiat(amount, poolTokenAddresses[i])
  )

  const optimized = useMemo(() => {
    return amountsIn.every((amount, i) => bnum(amount).eq(optAmountsIn[i]))
  }, [amountsIn, optAmountsIn])

  const optimize = useCallback(() => {
    FIELDS.forEach((f, i) => {
      let value = optAmountsIn[i]
      if (value === '') value = '0'
      setValue(f, value)
    })

    setFocusedElement('Optimize')
    trigger()
  }, [optAmountsIn, setValue, trigger])

  const amountsInFiatValueSum = useMemo(
    () =>
      amountsInFiatValue
        .reduce((acc, fiatValue) => acc.plus(fiatValue), bnum(0))
        .toString(),
    [amountsInFiatValue]
  )

  const submitDisabled = useMemo(
    () =>
      amountsIn.every((amount) => bnum(amount).isZero()) ||
      Object.values(formState.errors).length > 0,
    [formState, amountsIn]
  )

  return {
    activeField,
    amountsIn,
    amountsInFiatValue,
    amountsInFiatValueSum,
    assets,
    clearErrors,
    control,
    focusedElement,
    formState,
    fields: FIELDS,
    isNative,
    optimized,
    optimizeDisabled,
    maxBalances,
    maxSafeBalances,
    optimize,
    resetFields,
    setActiveField,
    setFocusedElement,
    setValue,
    submitDisabled,
    trigger,
    watch,
  }
}
