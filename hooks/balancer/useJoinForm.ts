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

import {
  HIGH_PRICE_IMPACT,
  REKT_PRICE_IMPACT,
} from 'config/constants/liquidityPool'
import { LiquidityFieldType } from 'config/constants'
import { bnum } from 'utils/bnum'
import { isEthereum } from 'utils/isEthereum'
import { useBalances, useChain, useFiat, useStaking } from 'hooks'
import { useJoinMath } from './useJoinMath'

export const FIELDS: LiquidityFieldType[] = [
  LiquidityFieldType.TokenA,
  LiquidityFieldType.TokenB,
]

export type JoinPoolForm = {
  [LiquidityFieldType.TokenA]: string
  [LiquidityFieldType.TokenB]: string
  [LiquidityFieldType.UseNative]: boolean
  [LiquidityFieldType.HighPriceImpact]: boolean
}

const DEFAULT_VALUES = {
  [LiquidityFieldType.TokenA]: '',
  [LiquidityFieldType.TokenB]: '',
  [LiquidityFieldType.UseNative]: true,
  [LiquidityFieldType.HighPriceImpact]: false,
}

export type UseJoinFormReturns = {
  assets: Hash[]
  activeField: LiquidityFieldType | null
  setActiveField(value: LiquidityFieldType | null): void
  isNative: boolean
  maxBalances: string[]
  maxSafeBalances: string[]
  formState: UseFormStateReturn<JoinPoolForm>
  clearErrors: UseFormClearErrors<JoinPoolForm>
  control: Control<JoinPoolForm>
  fields: LiquidityFieldType[]
  optimized: boolean
  optimize(): void
  resetFields(): void
  setValue: UseFormSetValue<JoinPoolForm>
  priceImpact: number
  trigger: UseFormTrigger<JoinPoolForm>
  watch: UseFormWatch<JoinPoolForm>
  joinAmounts: string[]
  joinAmountsFiatValue: string[]
  totalJoinFiatValue: string
  submitDisabled: boolean
  resetDisabled: boolean
  optimizeDisabled: boolean
  setFocusedElement(value: JoinPoolFormElement): void
  focusedElement: JoinPoolFormElement
}

export type JoinPoolFormElement = 'Input' | 'Max' | 'Optimize' | null

export function useJoinForm(): UseJoinFormReturns {
  const [activeField, setActiveField] = useState<LiquidityFieldType | null>(
    null
  )
  const [focusedElement, setFocusedElement] =
    useState<JoinPoolFormElement>(null)

  const balanceOf = useBalances()
  const { chainId, nativeCurrency } = useChain()
  const toFiat = useFiat()
  const { poolTokenAddresses } = useStaking()
  const { calcPriceImpact, calcOptimizedAmounts } = useJoinMath()

  const { clearErrors, control, formState, reset, trigger, setValue, watch } =
    useForm<JoinPoolForm>({
      mode: 'onChange',
      defaultValues: DEFAULT_VALUES,
    })

  const resetFields = useCallback(() => {
    reset(DEFAULT_VALUES)
    setFocusedElement(null)
  }, [reset])

  const isNative = watch(LiquidityFieldType.UseNative)
  const priceImpactAgreement = watch(LiquidityFieldType.HighPriceImpact)

  const assets = useMemo(() => {
    return poolTokenAddresses.map((addr) => {
      if (!isNative) return addr
      if (addr !== nativeCurrency.wrappedTokenAddress) return addr
      return nativeCurrency.address
    })
  }, [
    isNative,
    nativeCurrency.address,
    nativeCurrency.wrappedTokenAddress,
    poolTokenAddresses,
  ])

  const unsanitizedJoinAmounts = FIELDS.map((field) =>
    watch(field as any)
  ) as string[]

  const joinAmounts = unsanitizedJoinAmounts.map((a) =>
    bnum(a).toString()
  ) as string[]

  const joinAmountsFiatValue = joinAmounts.map((amount, i) =>
    toFiat(amount, assets[i])
  )

  const totalJoinFiatValue = useMemo(
    () =>
      joinAmountsFiatValue
        .reduce((acc, fiatValue) => acc.plus(fiatValue), bnum(0))
        .toString(),
    [joinAmountsFiatValue]
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
        if (address !== nativeCurrency.address) return balance
        const safeBalance = bnum(balance).minus(0.05)
        return safeBalance.gt(0) ? safeBalance.toString() : '0'
      }),
    [maxBalances, assets, nativeCurrency.address]
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
      (isEthereum(chainId) &&
        (priceImpact >= REKT_PRICE_IMPACT ||
          (priceImpact >= HIGH_PRICE_IMPACT && !priceImpactAgreement))),
    [chainId, formState, joinAmounts, priceImpact, priceImpactAgreement]
  )

  const optimize = useCallback(() => {
    setFocusedElement('Optimize')

    FIELDS.forEach((field, i) => {
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
    fields: FIELDS,
    formState,
    isNative,
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
    joinAmountsFiatValue,
    totalJoinFiatValue,
    priceImpact,
    setFocusedElement,
    focusedElement,
  }
}
