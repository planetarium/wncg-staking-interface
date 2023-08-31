import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Control,
  useForm,
  UseFormClearErrors,
  UseFormSetValue,
  UseFormStateReturn,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form'
import { useAtomValue } from 'jotai'

import { slippageAtom } from 'states/system'
import {
  HIGH_PRICE_IMPACT,
  REKT_PRICE_IMPACT,
} from 'config/constants/liquidityPool'
import { LiquidityFieldType } from 'config/constants'
import { bnum } from 'utils/bnum'
import { calcSlippageBsp } from 'utils/calcSlippageBsp'
import { isEthereum } from 'utils/isEthereum'
import { useAuth, useChain, useFiat, useStaking } from 'hooks'
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
  priceImpact: string
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
  const [priceImpact, setPriceImpact] = useState('0')

  const { account } = useAuth()
  const { chainId, nativeCurrency } = useChain()
  const toFiat = useFiat()
  const { poolTokenAddresses } = useStaking()

  const slippage = useAtomValue(slippageAtom) ?? '0.5'
  const slippageBsp = calcSlippageBsp(slippage)

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

  const { maxBalances, maxSafeBalances, optimizedAmountsIn, queryJoin } =
    useJoinMath(isNative)

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

  const updatePriceImpact = useCallback(async () => {
    try {
      const res = await queryJoin({
        assets,
        amountsIn: joinAmounts,
        account: account!,
        slippageBsp,
      })

      if (res) {
        setPriceImpact(res.priceImpact)
      }
    } catch (error) {
      setPriceImpact('0')
    }
  }, [account, assets, joinAmounts, queryJoin, slippageBsp])

  const optimizeDisabled = useMemo(
    () => maxBalances.some((b) => bnum(b).isZero()),
    [maxBalances]
  )

  const optimized = useMemo(() => {
    return joinAmounts.every(
      (amount, i) =>
        bnum(amount).eq(optimizedAmountsIn[i]) && bnum(amount).gt(0)
    )
  }, [joinAmounts, optimizedAmountsIn])

  // Disabled states
  const resetDisabled = useMemo(
    () => unsanitizedJoinAmounts.every((a) => !a.trim()),
    [unsanitizedJoinAmounts]
  )

  const submitDisabled = useMemo(
    () =>
      joinAmounts.every((a) => bnum(a).isZero()) ||
      Object.values(formState.errors).length > 0 ||
      (isEthereum(chainId) &&
        (bnum(priceImpact).gte(REKT_PRICE_IMPACT) ||
          (bnum(priceImpact).gte(HIGH_PRICE_IMPACT) && !priceImpactAgreement))),
    [chainId, formState, joinAmounts, priceImpact, priceImpactAgreement]
  )

  const optimize = useCallback(() => {
    setFocusedElement('Optimize')

    FIELDS.forEach((field, i) => {
      setValue(field as 'TokenA' | 'TokenB', optimizedAmountsIn[i])
    })

    trigger()
  }, [optimizedAmountsIn, setValue, trigger])

  useEffect(() => {
    updatePriceImpact()
  }, [updatePriceImpact])

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
