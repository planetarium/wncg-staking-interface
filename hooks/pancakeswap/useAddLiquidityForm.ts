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
import { useAddLiquidity } from './useAddLiquidity'

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

  const { assets, maxBalances, maxSafeBalances, calcOptimizedAmounts } =
    useAddLiquidityMath(isNative)

  const validate = useAddLiquidity(assets, amountsIn)

  const { data: optAmountsIn = null } = useQuery(
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

  const optimizeDisabled = useMemo(() => {
    return optAmountsIn == null || maxBalances.some((amt) => bnum(amt).isZero())
  }, [optAmountsIn, maxBalances])

  const resetFields = useCallback(() => {
    reset(DEFAULT_VALUES)
  }, [reset])

  const amountsInFiatValue = amountsIn.map((amount, i) =>
    toFiat(amount, poolTokenAddresses[i])
  )

  const optimized = useMemo(() => {
    if (optimizeDisabled) return false
    return amountsIn.every(
      (amt, i) => bnum(amt).eq(optAmountsIn![i]) && bnum(amt).gt(0)
    )
  }, [amountsIn, optAmountsIn, optimizeDisabled])

  const optimize = useCallback(() => {
    FIELDS.forEach((f, i) => {
      let value = optAmountsIn?.[i] ?? '0'
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
      amountsIn.some((amt) => bnum(amt).isZero()) ||
      Object.values(formState.errors).length > 0 ||
      !validate,
    [amountsIn, formState, validate]
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
