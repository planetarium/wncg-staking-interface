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

import config from 'config'
import { NATIVE_CURRENCY_ADDRESS } from 'config/constants/addresses'
import {
  HIGH_PRICE_IMPACT,
  REKT_PRICE_IMPACT,
} from 'config/constants/liquidityPool'
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
  activeField: LiquidityFieldType | null
  setActiveField(value: LiquidityFieldType | null): void
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
  setFocusedElement(value: JoinFormFocusedElement): void
  focusedElement: JoinFormFocusedElement
}

export type JoinFormFocusedElement =
  | 'Input'
  | 'MaxButton'
  | 'OptimizeButton'
  | null

export function useJoinForm(): UseJoinFormReturns {
  const [activeField, setActiveField] = useState<LiquidityFieldType | null>(
    null
  )
  const [focusedElement, setFocusedElement] =
    useState<JoinFormFocusedElement>(null)

  const balanceOf = useBalances()
  const toFiat = useFiat()
  const { poolTokenAddresses } = useStaking()
  const { calcPriceImpact, calcOptimizedAmounts } = useJoinMath()

  const { clearErrors, control, formState, reset, trigger, setValue, watch } =
    useForm<JoinFormFields>({
      mode: 'onChange',
      defaultValues,
    })

  const resetFields = useCallback(() => {
    reset(defaultValues)
    setFocusedElement(null)
  }, [reset])

  const isNativeCurrency = watch('isNativeCurrency')
  const priceImpactAgreement = watch('priceImpactAgreement')

  const assets = useMemo(() => {
    return poolTokenAddresses.map((addr) => {
      if (!isNativeCurrency) return addr
      if (addr !== config.wrapped) return addr
      return NATIVE_CURRENCY_ADDRESS
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
        if (address !== NATIVE_CURRENCY_ADDRESS) return balance
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
    () => unsanitizedJoinAmounts.every((a) => !a.trim()),
    [unsanitizedJoinAmounts]
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
    setFocusedElement('OptimizeButton')

    joinFormFields.forEach((field, i) => {
      setValue(field as 'TokenA' | 'TokenB', optimizedAmounts[i])
    })

    trigger()
  }, [optimizedAmounts, setValue, trigger])

  return {
    assets,
    activeField,
    setActiveField,
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
    setFocusedElement,
    focusedElement,
  }
}
