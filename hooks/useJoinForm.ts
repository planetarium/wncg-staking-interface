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
import { useAtom } from 'jotai'

import { showOptimizeErrorAtom } from 'states/form'
import config from 'config'
import { HIGH_PRICE_IMPACT, REKT_PRICE_IMPACT } from 'config/misc'
import { LiquidityFieldType } from 'config/constants'
import { bnum } from 'utils/bnum'
import { useBalances, useFiat, useStaking } from 'hooks'
import { useJoinMath } from './useJoinMath'

export const joinFormFields: LiquidityFieldType[] = [
  LiquidityFieldType.TokenA,
  LiquidityFieldType.TokenB,
]

const defaultValues = {
  [LiquidityFieldType.TokenA]: '',
  [LiquidityFieldType.TokenB]: '',
  isNativeCurrency: true,
  priceImpactAgreement: false,
}

export type JoinFormFields = {
  [LiquidityFieldType.TokenA]: string
  [LiquidityFieldType.TokenB]: string
  isNativeCurrency: boolean
  priceImpactAgreement: boolean
}

export type UseJoinFormReturns = {
  assets: Hash[]
  maxBalances: string[]
  maxSafeBalances: string[]
  formState: UseFormStateReturn<JoinFormFields>
  clearErrors: UseFormClearErrors<JoinFormFields>
  control: Control<JoinFormFields>
  fields: LiquidityFieldType[]
  optimized: boolean
  optimize(): void
  resetFields(): void
  setValue: UseFormSetValue<JoinFormFields>
  priceImpact: number
  trigger: UseFormTrigger<JoinFormFields>
  watch: UseFormWatch<JoinFormFields>
  joinAmounts: string[]
  joinAmountsInFiatValue: string[]
  totalJoinFiatValue: string
  submitDisabled: boolean
  resetDisabled: boolean
  optimizeDisabled: boolean
}

export function useJoinForm(): UseJoinFormReturns {
  const balanceOf = useBalances()
  const toFiat = useFiat()
  const { poolTokenAddresses } = useStaking()
  const { calcPriceImpact, calcOptimizedAmounts } = useJoinMath()

  const [showOptError, setShowOptError] = useAtom(showOptimizeErrorAtom)

  const { clearErrors, control, formState, reset, trigger, setValue, watch } =
    useForm<JoinFormFields>({
      mode: 'onChange',
      defaultValues,
    })

  const resetFields = useCallback(() => {
    reset(defaultValues)
  }, [reset])

  const isNativeCurrency = watch('isNativeCurrency')
  const priceImpactAgreement = watch('priceImpactAgreement')

  const assets = useMemo(() => {
    return poolTokenAddresses.map((addr) => {
      if (!isNativeCurrency) return addr
      if (addr !== config.weth) return addr
      return config.nativeCurrency.address
    })
  }, [isNativeCurrency, poolTokenAddresses])

  const unsanitizedJoinAmounts = joinFormFields.map((field) =>
    watch(field as any)
  ) as string[]

  const joinAmounts = unsanitizedJoinAmounts.map((a) =>
    bnum(a).toString()
  ) as string[]

  const joinAmountsInFiatValue = joinAmounts.map((amount, i) =>
    toFiat(amount, assets[i])
  )

  const totalJoinFiatValue = useMemo(
    () =>
      joinAmountsInFiatValue
        .reduce((acc, fiatValue) => acc.plus(fiatValue), bnum(0))
        .toString(),
    [joinAmountsInFiatValue]
  )

  const priceImpact = useMemo(
    () => calcPriceImpact(joinAmounts),
    [calcPriceImpact, joinAmounts]
  )

  const maxBalances = useMemo(
    () => assets.map((a) => balanceOf(a)),
    [assets, balanceOf]
  )

  const maxSafeBalances = useMemo(
    () =>
      maxBalances.map((balance, i) => {
        const address = assets[i]
        if (address !== config.nativeCurrency.address) return balance
        const safeBalance = bnum(balance).minus(0.05)
        return safeBalance.gt(0) ? safeBalance.toString() : '0'
      }),
    [maxBalances, assets]
  )

  const optimizedAmounts = useMemo(
    () => calcOptimizedAmounts(maxSafeBalances),
    [calcOptimizedAmounts, maxSafeBalances]
  )

  const optimizeDisabled = useMemo(
    () => maxBalances.some((b) => bnum(b).isZero()),
    [maxBalances]
  )

  const optimized = useMemo(() => {
    return joinAmounts.every(
      (amount, i) => bnum(amount).eq(optimizedAmounts[i]) && bnum(amount).gt(0)
    )
  }, [joinAmounts, optimizedAmounts])

  const resetDisabled = useMemo(
    () => unsanitizedJoinAmounts.every((a) => !a.trim()) && !showOptError,
    [showOptError, unsanitizedJoinAmounts]
  )

  const submitDisabled = useMemo(
    () =>
      joinAmounts.every((a) => bnum(a).isZero()) ||
      Object.values(formState.errors).length > 0 ||
      priceImpact >= REKT_PRICE_IMPACT ||
      (priceImpact >= HIGH_PRICE_IMPACT && !priceImpactAgreement),
    [formState.errors, joinAmounts, priceImpact, priceImpactAgreement]
  )

  const optimize = useCallback(() => {
    if (optimizeDisabled) {
      setShowOptError(true)
      return
    }

    joinFormFields.forEach((field, i) => {
      setValue(field as 'TokenA' | 'TokenB', optimizedAmounts[i])
    })

    trigger()
  }, [optimizeDisabled, optimizedAmounts, setShowOptError, setValue, trigger])

  return {
    assets,
    clearErrors,
    control,
    fields: joinFormFields,
    formState,
    maxBalances,
    maxSafeBalances,
    optimized,
    optimize,
    optimizeDisabled,
    resetDisabled,
    resetFields,
    setValue,
    submitDisabled,
    trigger,
    watch,
    joinAmounts,
    joinAmountsInFiatValue,
    totalJoinFiatValue,
    priceImpact,
  }
}
