import { MouseEvent, useCallback, useMemo } from 'react'
import type { UseFormReturn } from 'react-hook-form'

import { getUserBalances } from 'app/states/balance'
import { ModalCategory } from 'app/states/modal'
import Decimal, { sanitizeNumber } from 'utils/num'
import { useAppSelector, useJoinMath, useModal, useUsd } from 'hooks'
import type { JoinFormFields } from './type'

export function useJoinForm(
  isNativeAsset: boolean,
  useFormReturn: UseFormReturn<JoinFormFields>
) {
  const { clearErrors, formState, setValue, trigger, watch } = useFormReturn

  const { getPriceImpact, getPropAmounts, getOptimizedAmounts } = useJoinMath()
  const { addModal } = useModal()
  const { calculateUsdValue } = useUsd()

  const userBalances = useAppSelector(getUserBalances)

  const wncgBalance = userBalances.wncg
  const ethNetBalance = isNativeAsset ? userBalances.eth : userBalances.weth
  const ethBalanceAvailable = isNativeAsset
    ? Math.max(new Decimal(ethNetBalance).minus(0.05).toNumber(), 0).toString()
    : ethNetBalance

  const ethValue = sanitizeNumber(watch('ethAmount'))
  const wncgValue = sanitizeNumber(watch('wncgAmount'))
  const priceImpactAgreement = watch('priceImpactAgreement')
  const amounts = useMemo(() => [wncgValue, ethValue], [ethValue, wncgValue])

  const optimizedMinAmounts = getOptimizedAmounts(isNativeAsset)

  const setMaxValue = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const { value } = e.currentTarget as typeof e.currentTarget & {
        value: keyof JoinFormFields
      }
      const inputName = value
      clearErrors(inputName)

      if (inputName === 'wncgAmount') {
        setValue('wncgAmount', wncgBalance)
        return
      }
      setValue('ethAmount', ethBalanceAvailable)
    },
    [clearErrors, ethBalanceAvailable, setValue, wncgBalance]
  )

  const setPropAmount = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const inputName = e.currentTarget.value as 'wncgAmount' | 'ethAmount'
      const currentTokenIndex = inputName === 'wncgAmount' ? 0 : 1

      const propAmounts = getPropAmounts(amounts, currentTokenIndex)
      setValue(inputName, propAmounts[currentTokenIndex])
      trigger(inputName)
    },
    [amounts, getPropAmounts, setValue, trigger]
  )

  function toggleHighPriceImpactCheckbox(value: boolean) {
    setValue('priceImpactAgreement', value)
  }

  const joinMax = useCallback(() => {
    setValue('ethAmount', ethBalanceAvailable)
    setValue('wncgAmount', wncgBalance)
    clearErrors()
  }, [clearErrors, ethBalanceAvailable, setValue, wncgBalance])

  const joinOpt = useCallback(() => {
    const propMinAmounts = getOptimizedAmounts(isNativeAsset)

    setValue('wncgAmount', propMinAmounts[0])
    setValue('ethAmount', propMinAmounts[1])
    trigger()
  }, [getOptimizedAmounts, isNativeAsset, setValue, trigger])

  const priceImpact = useMemo(() => {
    return getPriceImpact([wncgValue, ethValue])
  }, [ethValue, getPriceImpact, wncgValue])

  const highPriceImpact = useMemo(() => {
    return new Decimal(priceImpact).gte(0.01)
  }, [priceImpact])

  const totalUsdValue = useMemo(() => {
    return new Decimal(calculateUsdValue('wncg', wncgValue))
      .add(calculateUsdValue('weth', ethValue))
      .toString()
  }, [calculateUsdValue, ethValue, wncgValue])

  const openPreviewModal = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()

      addModal({
        category: ModalCategory.JoinPreview,
        props: {
          amounts,
          isNativeAsset,
          priceImpact,
          totalUsdValue,
        },
      })
    },
    [addModal, amounts, isNativeAsset, priceImpact, totalUsdValue]
  )

  const maximized = useMemo(
    () =>
      new Decimal(wncgValue).eq(wncgBalance) &&
      !new Decimal(ethValue).isZero() &&
      new Decimal(ethValue).eq(ethBalanceAvailable),
    [ethBalanceAvailable, ethValue, wncgBalance, wncgValue]
  )

  const optimized = useMemo(
    () =>
      amounts.every((amount, i) =>
        new Decimal(amount).eq(optimizedMinAmounts[i])
      ),
    [amounts, optimizedMinAmounts]
  )

  const showPropButton = useMemo(() => {
    const hasError = !!Object.keys(formState.errors).length
    const wncg = new Decimal(wncgValue)
    const eth = new Decimal(ethValue)

    return {
      wncgAmount: !hasError && wncg.isZero() && !eth.isZero(),
      ethAmount: !hasError && eth.isZero() && !wncg.isZero(),
    }
  }, [ethValue, formState, wncgValue])

  const previewDisabled = useMemo(
    () =>
      (new Decimal(wncgValue).isZero() && new Decimal(ethValue).isZero()) ||
      (highPriceImpact && !priceImpactAgreement),
    [ethValue, highPriceImpact, priceImpactAgreement, wncgValue]
  )

  const joinDisabled = useMemo(
    () => new Decimal(priceImpact).gte(0.2),
    [priceImpact]
  )

  const maxDisabled = useMemo(
    () =>
      new Decimal(wncgBalance).isZero() &&
      new Decimal(ethBalanceAvailable).isZero(),
    [ethBalanceAvailable, wncgBalance]
  )

  const optDisabled = useMemo(
    () => optimizedMinAmounts.every((amount) => new Decimal(amount).isZero()),
    [optimizedMinAmounts]
  )

  return {
    highPriceImpact,
    joinDisabled,
    joinMax,
    joinOpt,
    maximized,
    maxDisabled,
    openPreviewModal,
    optimized,
    optDisabled,
    previewDisabled,
    priceImpact,
    setMaxValue,
    setPropAmount,
    showPropButton,
    toggleHighPriceImpactCheckbox,
    totalUsdValue,
  }
}
