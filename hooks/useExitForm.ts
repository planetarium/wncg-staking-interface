import { MouseEvent, useCallback, useMemo } from 'react'
import {
  Control,
  useForm,
  UseFormClearErrors,
  UseFormResetField,
  UseFormSetValue,
  UseFormStateReturn,
  UseFormWatch,
} from 'react-hook-form'

import config from 'config'
import { LiquidityFieldType } from 'config/constants'
import { HIGH_PRICE_IMPACT, REKT_PRICE_IMPACT } from 'config/misc'
import { bnum } from 'utils/bnum'
import { useBalances, useFiat, useExitMath, useStaking } from 'hooks'

export type ExitFormFields = {
  [LiquidityFieldType.LiquidityPercent]: string
  [LiquidityFieldType.ExitAmount]: string
  exitType: Hash | null
  priceImpactAgreement?: boolean
}

export type UseExitFormReturns = {
  assets: Hash[]
  bptIn: string
  control: Control<ExitFormFields>
  clearErrors: UseFormClearErrors<ExitFormFields>
  exactOut: boolean
  exitAmount: string
  exitAmounts: string[]
  exitAmountInFiatValue: string
  exitType: Hash | null
  totalExitFiatValue: string
  isProportional: boolean
  bptOutPcnt: string
  isNativeCurrency: boolean
  setValue: UseFormSetValue<ExitFormFields>
  submitDisabled: boolean
  singleExitMaxed: boolean
  singleExitTokenOutIndex: number
  singleExitMaxAmounts: string[]
  priceImpact: number
  formState: UseFormStateReturn<ExitFormFields>
  resetField: UseFormResetField<ExitFormFields>
  resetFields(): void
  setMaxValue(e: MouseEvent<HTMLButtonElement>): void
  watch: UseFormWatch<ExitFormFields>
}

const defaultValues: ExitFormFields = {
  [LiquidityFieldType.LiquidityPercent]: '100',
  [LiquidityFieldType.ExitAmount]: '',
  exitType: null,
  priceImpactAgreement: false,
}

export function useExitForm(): UseExitFormReturns {
  const balanceOf = useBalances()
  const toFiat = useFiat()
  const { poolTokenAddresses, stakedTokenAddress } = useStaking()
  const { calcBptIn, calcExitAmounts, calcPriceImpact, singleExitMaxAmounts } =
    useExitMath()

  const bptBalance = balanceOf(stakedTokenAddress)

  const {
    clearErrors,
    control,
    formState,
    reset,
    resetField,
    setValue,
    watch,
  } = useForm<ExitFormFields>({
    mode: 'onChange',
    defaultValues,
  })

  const exitType = watch('exitType')
  const bptOutPcnt = watch(LiquidityFieldType.LiquidityPercent)
  const tokenOutAmount = watch(LiquidityFieldType.ExitAmount)
  const priceImpactAgreement = watch('priceImpactAgreement')
  const isNativeCurrency = exitType === config.nativeCurrency.address

  const isProportional = exitType === null

  const assets = useMemo(() => {
    if (exitType !== config.nativeCurrency.address) return poolTokenAddresses

    const _assets = [...poolTokenAddresses]
    _assets[poolTokenAddresses.indexOf(config.weth)] =
      config.nativeCurrency.address
    return _assets
  }, [exitType, poolTokenAddresses])

  const singleExitTokenOutIndex = useMemo(() => {
    if (isProportional) return 0
    if (exitType === config.nativeCurrency.address) {
      return poolTokenAddresses.indexOf(config.weth)
    }
    if (poolTokenAddresses.includes(exitType)) {
      return poolTokenAddresses.indexOf(exitType)
    }

    return -1
  }, [exitType, isProportional, poolTokenAddresses])

  const singleExitMaxed = useMemo(
    () =>
      !isProportional &&
      bnum(tokenOutAmount).eq(singleExitMaxAmounts[singleExitTokenOutIndex]),
    [
      isProportional,
      singleExitMaxAmounts,
      singleExitTokenOutIndex,
      tokenOutAmount,
    ]
  )

  const exactOut = useMemo(
    () => !isProportional && !singleExitMaxed,
    [isProportional, singleExitMaxed]
  )

  const bptIn = useMemo(
    () =>
      calcBptIn({
        exactOut,
        isProportional,
        tokenOutAmount,
        tokenOutIndex: singleExitTokenOutIndex,
        bptOutPcnt,
      }),
    [
      bptOutPcnt,
      calcBptIn,
      exactOut,
      isProportional,
      singleExitTokenOutIndex,
      tokenOutAmount,
    ]
  )

  const exitAmount = bnum(bptBalance).times(bptOutPcnt).div(100).toFixed(18, 3)
  const exitAmountInFiatValue = toFiat(exitAmount, stakedTokenAddress)

  const priceImpact = useMemo(
    () =>
      calcPriceImpact({
        exactOut,
        isProportional,
        tokenOutIndex: singleExitTokenOutIndex,
        tokenOutAmount,
        bptOutPcnt,
      }),
    [
      bptOutPcnt,
      calcPriceImpact,
      exactOut,
      isProportional,
      singleExitTokenOutIndex,
      tokenOutAmount,
    ]
  )

  const exitAmounts = useMemo(
    () =>
      calcExitAmounts({
        isProportional,
        tokenOutIndex: singleExitTokenOutIndex,
        tokenOutAmount,
        bptOutPcnt,
      }),
    [
      bptOutPcnt,
      calcExitAmounts,
      isProportional,
      singleExitTokenOutIndex,
      tokenOutAmount,
    ]
  )

  const totalExitFiatValue = useMemo(
    () =>
      poolTokenAddresses
        .reduce((acc, addr, i) => {
          const address =
            exitType === config.nativeCurrency.address
              ? config.nativeCurrency.address
              : addr

          return acc.plus(toFiat(exitAmounts[i], address))
        }, bnum(0))
        .toString() ?? '0',
    [exitAmounts, exitType, poolTokenAddresses, toFiat]
  )

  const submitDisabled = useMemo(
    () =>
      (!isProportional && exitAmounts.every((a) => bnum(a).isZero())) ||
      Object.values(formState.errors).length > 0 ||
      priceImpact >= REKT_PRICE_IMPACT ||
      (priceImpact >= HIGH_PRICE_IMPACT && !priceImpactAgreement),
    [exitAmounts, formState, isProportional, priceImpact, priceImpactAgreement]
  )

  const setMaxValue = useCallback(
    (e: MouseEvent<HTMLButtonElement>): void => {
      if (isProportional) return

      setValue(
        LiquidityFieldType.ExitAmount,
        singleExitMaxAmounts[singleExitTokenOutIndex] ?? ''
      )
      clearErrors(LiquidityFieldType.ExitAmount)
    },
    [
      clearErrors,
      isProportional,
      setValue,
      singleExitMaxAmounts,
      singleExitTokenOutIndex,
    ]
  )

  const resetFields = useCallback(() => {
    reset(defaultValues)
  }, [reset])

  return {
    assets,
    bptIn,
    clearErrors,
    control,
    exactOut,
    exitType,
    exitAmount,
    exitAmounts,
    exitAmountInFiatValue,
    bptOutPcnt,
    isNativeCurrency,
    setValue,
    isProportional,
    singleExitTokenOutIndex,
    singleExitMaxAmounts,
    singleExitMaxed,
    submitDisabled,
    formState,
    resetField,
    resetFields,
    priceImpact,
    setMaxValue,
    totalExitFiatValue,
    watch,
  }
}
