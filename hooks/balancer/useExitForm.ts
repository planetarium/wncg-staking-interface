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

import { LiquidityFieldType } from 'config/constants'
import {
  HIGH_PRICE_IMPACT,
  REKT_PRICE_IMPACT,
} from 'config/constants/liquidityPool'
import { bnum } from 'utils/bnum'
import { useBalances, useChain, useFiat, useStaking } from 'hooks'
import { useExitMath } from './useExitMath'

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
  isExactOut: boolean
  exitAmount: string
  exitAmounts: string[]
  exitAmountInFiatValue: string
  exitType: Hash | null
  totalExitFiatValue: string
  isPropExit: boolean
  bptOutPcnt: string
  isNative: boolean
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
  const { chainId } = useChain()
  const { nativeCurrency } = useChain()
  const toFiat = useFiat()
  const { calcBptIn, calcExitAmounts, calcPriceImpact, singleExitMaxAmounts } =
    useExitMath()
  const { lpToken, poolTokenAddresses } = useStaking()

  const lpBalance = balanceOf(lpToken?.address)

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
  const isNative = exitType === nativeCurrency.address

  const isPropExit = exitType === null

  const assets = useMemo(() => {
    if (exitType !== nativeCurrency.address) return poolTokenAddresses

    const _assets = [...poolTokenAddresses]
    _assets[poolTokenAddresses.indexOf(nativeCurrency.wrappedTokenAddress)] =
      nativeCurrency.address
    return _assets
  }, [
    exitType,
    nativeCurrency.address,
    nativeCurrency.wrappedTokenAddress,
    poolTokenAddresses,
  ])

  const singleExitTokenOutIndex = useMemo(() => {
    switch (true) {
      case isPropExit:
        return 0
      case exitType === nativeCurrency.address:
        return poolTokenAddresses.indexOf(nativeCurrency.wrappedTokenAddress)
      case exitType && poolTokenAddresses.includes(exitType):
        return poolTokenAddresses.indexOf(exitType!)
      default:
        return -1
    }
  }, [
    exitType,
    isPropExit,
    nativeCurrency.address,
    nativeCurrency.wrappedTokenAddress,
    poolTokenAddresses,
  ])

  const singleExitMaxed = useMemo(
    () =>
      !isPropExit &&
      bnum(tokenOutAmount).eq(singleExitMaxAmounts[singleExitTokenOutIndex]),
    [isPropExit, singleExitMaxAmounts, singleExitTokenOutIndex, tokenOutAmount]
  )

  const isExactOut = useMemo(
    () => !isPropExit && !singleExitMaxed,
    [isPropExit, singleExitMaxed]
  )

  const bptIn = useMemo(
    () =>
      calcBptIn({
        isExactOut,
        isPropExit,
        tokenOutAmount,
        tokenOutIndex: singleExitTokenOutIndex,
        bptOutPcnt,
      }),
    [
      bptOutPcnt,
      calcBptIn,
      isExactOut,
      isPropExit,
      singleExitTokenOutIndex,
      tokenOutAmount,
    ]
  )

  const exitAmount = bnum(lpBalance).times(bptOutPcnt).div(100).toFixed(18, 3)
  const exitAmountInFiatValue = toFiat(exitAmount, lpToken?.address)

  const priceImpact = useMemo(
    () =>
      calcPriceImpact({
        isExactOut,
        isPropExit,
        tokenOutIndex: singleExitTokenOutIndex,
        tokenOutAmount,
        bptOutPcnt,
      }),
    [
      bptOutPcnt,
      calcPriceImpact,
      isExactOut,
      isPropExit,
      singleExitTokenOutIndex,
      tokenOutAmount,
    ]
  )

  const exitAmounts = useMemo(
    () =>
      calcExitAmounts({
        isPropExit,
        tokenOutIndex: singleExitTokenOutIndex,
        tokenOutAmount,
        bptOutPcnt,
      }),
    [
      bptOutPcnt,
      calcExitAmounts,
      isPropExit,
      singleExitTokenOutIndex,
      tokenOutAmount,
    ]
  )

  const totalExitFiatValue = useMemo(
    () =>
      poolTokenAddresses
        .reduce((acc, addr, i) => {
          const address =
            exitType === nativeCurrency.address ? nativeCurrency.address : addr

          return acc.plus(toFiat(exitAmounts[i], address))
        }, bnum(0))
        .toString() ?? '0',
    [exitAmounts, exitType, nativeCurrency.address, poolTokenAddresses, toFiat]
  )

  const submitDisabled = useMemo(
    () =>
      (!isPropExit && exitAmounts.every((a) => bnum(a).isZero())) ||
      Object.values(formState.errors).length > 0 ||
      priceImpact >= REKT_PRICE_IMPACT ||
      (priceImpact >= HIGH_PRICE_IMPACT && !priceImpactAgreement),
    [exitAmounts, formState, isPropExit, priceImpact, priceImpactAgreement]
  )

  const setMaxValue = useCallback(
    (e: MouseEvent<HTMLButtonElement>): void => {
      if (isPropExit) return

      setValue(
        LiquidityFieldType.ExitAmount,
        singleExitMaxAmounts[singleExitTokenOutIndex] ?? ''
      )
      clearErrors(LiquidityFieldType.ExitAmount)
    },
    [
      clearErrors,
      isPropExit,
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
    isExactOut,
    exitType,
    exitAmount,
    exitAmounts,
    exitAmountInFiatValue,
    bptOutPcnt,
    isNative,
    setValue,
    isPropExit,
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
