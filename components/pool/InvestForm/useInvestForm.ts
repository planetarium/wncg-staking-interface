import { MouseEvent, useCallback, useMemo } from 'react'
import type { UseFormReturn } from 'react-hook-form'

import { getUserBalances } from 'app/states/balance'
import { ModalCategory } from 'app/states/modal'
import Decimal, { sanitizeNumber } from 'utils/num'
import { useAppSelector, useInvestMath, useModal, useUsd } from 'hooks'
import type { InvestFormFields } from './type'

export function useInvestForm(
  isNativeAsset: boolean,
  useFormReturn: UseFormReturn<InvestFormFields>
) {
  const { clearErrors, formState, setValue, trigger, watch } = useFormReturn

  const { getPriceImpact, getPropAmounts, getOptimizedAmounts } =
    useInvestMath()
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
  const amounts = useMemo(() => [wncgValue, ethValue], [ethValue, wncgValue])

  const setMaxValue = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const { value } = e.currentTarget as typeof e.currentTarget & {
        value: keyof InvestFormFields
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

  const investMax = useCallback(() => {
    setValue('ethAmount', ethBalanceAvailable)
    setValue('wncgAmount', wncgBalance)
    clearErrors()
  }, [clearErrors, ethBalanceAvailable, setValue, wncgBalance])

  const investOpt = useCallback(() => {
    const propMaxAmounts = getOptimizedAmounts(isNativeAsset)
    setValue('wncgAmount', propMaxAmounts[0])
    setValue('ethAmount', propMaxAmounts[1])
    trigger()
  }, [getOptimizedAmounts, isNativeAsset, setValue, trigger])

  const priceImpact = useMemo(() => {
    return getPriceImpact([wncgValue, ethValue])
  }, [ethValue, getPriceImpact, wncgValue])

  const totalUsdValue = useMemo(() => {
    return new Decimal(calculateUsdValue('wncg', wncgValue))
      .add(calculateUsdValue('weth', ethValue))
      .toString()
  }, [calculateUsdValue, ethValue, wncgValue])

  const openPreviewModal = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()

      addModal({
        category: ModalCategory.InvestPreview,
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

  const optimized = useMemo(() => {
    const propMaxAmounts = getOptimizedAmounts(isNativeAsset)
    return amounts.every((amount, i) =>
      new Decimal(amount).eq(propMaxAmounts[i])
    )
  }, [amounts, getOptimizedAmounts, isNativeAsset])

  const showPropButton = useMemo(() => {
    const hasError = !!Object.keys(formState.errors).length
    const wncg = new Decimal(wncgValue)
    const eth = new Decimal(ethValue)

    return {
      wncgAmount: !hasError && wncg.isZero() && !eth.isZero(),
      ethAmount: !hasError && eth.isZero() && !wncg.isZero(),
    }
  }, [ethValue, formState, wncgValue])

  const investDisabled = useMemo(
    () => new Decimal(wncgValue).isZero() && new Decimal(ethValue).isZero(),
    [ethValue, wncgValue]
  )

  const maxOptDisabled = useMemo(
    () =>
      new Decimal(wncgBalance).isZero() &&
      new Decimal(ethBalanceAvailable).isZero(),
    [ethBalanceAvailable, wncgBalance]
  )

  return {
    investDisabled,
    investMax,
    investOpt,
    maximized,
    maxOptDisabled,
    openPreviewModal,
    optimized,
    priceImpact,
    setMaxValue,
    setPropAmount,
    showPropButton,
    totalUsdValue,
  }
}
