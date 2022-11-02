import { MouseEvent, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import type {
  Control,
  FieldErrorsImpl,
  UseFormClearErrors,
} from 'react-hook-form'
import { useAtomValue } from 'jotai'

import { pendingExitTxAtom } from 'states/form'
import { configService } from 'services/config'
import { bnum } from 'utils/num'
import { useFiatCurrency, usePool } from 'hooks'
import { useExitMath } from './useExitMath'

export type ExitFormFields = {
  bptOutPcnt: number
  exitType: string
  priceImpactAgreement: boolean
  tokenOutAmount: string
}

export type UseExitFormReturns = {
  assets: string[]
  bptIn: string
  bptOutPcnt: number
  clearErrors: UseFormClearErrors<ExitFormFields>
  control: Control<ExitFormFields, any>
  exactOut: boolean
  exitAmounts: string[]
  exitType: string
  errors: Partial<FieldErrorsImpl<ExitFormFields>>
  isProportional: boolean
  priceImpact: number
  priceImpactAgreement: boolean
  resetInputs(): void
  setMaxValue(e: MouseEvent<HTMLButtonElement>): void
  singleExitMaxAmounts: string[]
  singleExitTokenOutIndex: number
  togglePriceImpactAgreement(value: boolean): void
  tokenOutAmount: string
  totalExitAmountsInFiatValue: string
}

export function useExitForm(): UseExitFormReturns {
  const { calcBptIn, calcExitAmounts, calcPriceImpact, singleExitMaxAmounts } =
    useExitMath()
  const { toFiat } = useFiatCurrency()
  const { nativeAssetIndex, poolTokenAddresses } = usePool()

  const {
    bptOutPcnt: initBptOutPcnt,
    exitType: initExitType,
    tokenOutAmount: initTokenOutAmount,
  } = useAtomValue(pendingExitTxAtom)

  const { clearErrors, control, formState, resetField, setValue, watch } =
    useForm<ExitFormFields>({
      mode: 'onChange',
      defaultValues: {
        bptOutPcnt: initBptOutPcnt ?? 100,
        exitType: initExitType ?? 'all',
        priceImpactAgreement: false,
        tokenOutAmount: initTokenOutAmount ?? '',
      },
    })

  const exitType = watch('exitType')
  const bptOutPcnt = watch('bptOutPcnt')
  const tokenOutAmount = watch('tokenOutAmount')
  const priceImpactAgreement = watch('priceImpactAgreement')

  const isProportional = exitType === 'all'

  const singleExitTokenOutIndex = useMemo(() => {
    switch (true) {
      case exitType === configService.nativeAssetAddress:
        return nativeAssetIndex
      case poolTokenAddresses.includes(exitType):
        return poolTokenAddresses.indexOf(exitType)
      default:
        return -1
    }
  }, [exitType, nativeAssetIndex, poolTokenAddresses])

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

  const params = useMemo(
    () => ({
      exactOut,
      isProportional,
      tokenOutIndex: singleExitTokenOutIndex,
      tokenOutAmount,
      percent: bptOutPcnt,
    }),
    [
      bptOutPcnt,
      exactOut,
      isProportional,
      singleExitTokenOutIndex,
      tokenOutAmount,
    ]
  )

  const bptIn = useMemo(() => calcBptIn(params), [calcBptIn, params])

  const assets = useMemo(() => {
    if (exitType !== configService.nativeAssetAddress) return poolTokenAddresses
    const _assets = [...poolTokenAddresses]
    _assets[nativeAssetIndex] = configService.zeroAddress
    return _assets
  }, [exitType, nativeAssetIndex, poolTokenAddresses])

  const exitAmounts = useMemo(
    () => calcExitAmounts(params),
    [calcExitAmounts, params]
  )

  const totalExitAmountsInFiatValue = useMemo(
    () =>
      poolTokenAddresses
        .reduce((total, address, i) => {
          address =
            exitType === configService.nativeAssetAddress
              ? configService.nativeAssetAddress
              : address
          const delta = toFiat(address, bnum(exitAmounts[i]).toString())
          return total.plus(delta)
        }, bnum(0))
        .toFixed(2) || '0',
    [exitAmounts, exitType, poolTokenAddresses, toFiat]
  )

  const priceImpact = useMemo(
    () => calcPriceImpact(params),
    [calcPriceImpact, params]
  )

  const setMaxValue = useCallback(
    (e: MouseEvent<HTMLButtonElement>): void => {
      if (exitType === 'all') return

      setValue(
        'tokenOutAmount',
        singleExitMaxAmounts[singleExitTokenOutIndex] ?? ''
      )
      clearErrors('tokenOutAmount')
    },
    [
      clearErrors,
      exitType,
      setValue,
      singleExitMaxAmounts,
      singleExitTokenOutIndex,
    ]
  )

  const togglePriceImpactAgreement = useCallback(
    (value: boolean) => setValue('priceImpactAgreement', value),
    [setValue]
  )

  const resetInputs = useCallback(() => {
    resetField('bptOutPcnt')
    resetField('tokenOutAmount')
  }, [resetField])

  return {
    assets,
    bptIn,
    bptOutPcnt,
    clearErrors,
    control,
    errors: formState.errors,
    exitAmounts,
    exitType,
    exactOut,
    isProportional,
    priceImpact,
    priceImpactAgreement,
    resetInputs,
    setMaxValue,
    singleExitMaxAmounts,
    singleExitTokenOutIndex,
    togglePriceImpactAgreement,
    tokenOutAmount,
    totalExitAmountsInFiatValue,
  }
}
