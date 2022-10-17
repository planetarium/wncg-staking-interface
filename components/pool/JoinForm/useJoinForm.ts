import { MouseEvent, useCallback, useMemo } from 'react'
import type { UseFormReturn } from 'react-hook-form'

import { ModalCategory } from 'states/ui'
import { HIGH_PRICE_IMPACT, REKT_PRICE_IMPACT } from 'constants/poolLiquidity'
import { configService } from 'services/config'
import { gaEvent } from 'lib/gtag'
import { bnum, hasAmounts, sanitizeNumber } from 'utils/num'
import { getTokenSymbol } from 'utils/token'
import { useFiatCurrency, useJoinMath, useModal, usePool } from 'hooks'
import type { JoinFormFields } from './type'

export function useJoinForm(
  isNativeAsset: boolean,
  useFormReturn: UseFormReturn<JoinFormFields>
) {
  const { clearErrors, formState, setValue, trigger, watch } = useFormReturn

  const {
    calcPriceImpact,
    calcPropAmounts,
    calcOptimizedAmounts,
    calcUserPoolTokenBalances,
    calcUserPoolTokenBalancesAvailable,
  } = useJoinMath()
  const { addModal } = useModal()
  const {
    ercTokenIndex,
    nativeAssetIndex,
    poolTokenAddresses: rawPoolTokenAddresses,
  } = usePool()
  const { toFiat } = useFiatCurrency()

  const assets = useMemo(
    () =>
      rawPoolTokenAddresses.map((address, i) => {
        return isNativeAsset && i === nativeAssetIndex
          ? configService.nativeAssetAddress
          : address
      }) || [],
    [isNativeAsset, nativeAssetIndex, rawPoolTokenAddresses]
  )

  const wncgIndex = ercTokenIndex

  const userTokenBalances = useMemo(
    () => calcUserPoolTokenBalances(isNativeAsset),
    [calcUserPoolTokenBalances, isNativeAsset]
  )

  const userTokenBalancesAvailable = useMemo(
    () => calcUserPoolTokenBalancesAvailable(isNativeAsset),
    [calcUserPoolTokenBalancesAvailable, isNativeAsset]
  )

  const _ethValue = watch('ethAmount')
  const _wncgValue = watch('wncgAmount')
  const ethValue = sanitizeNumber(_ethValue)
  const wncgValue = sanitizeNumber(_wncgValue)
  const priceImpactAgreement = watch('priceImpactAgreement')
  const amounts = useMemo(
    () =>
      nativeAssetIndex === 0 ? [ethValue, wncgValue] : [wncgValue, ethValue],
    [ethValue, nativeAssetIndex, wncgValue]
  )

  const optimizedMinAmounts = calcOptimizedAmounts(isNativeAsset)

  const setMaxValue = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const { value: inputName } = e.currentTarget as typeof e.currentTarget & {
        value: keyof JoinFormFields
      }
      clearErrors(inputName)

      if (inputName === 'wncgAmount') {
        setValue('wncgAmount', userTokenBalancesAvailable[wncgIndex])
        gaEvent({
          name: `max_wncg`,
        })
        return
      }
      setValue('ethAmount', userTokenBalancesAvailable[nativeAssetIndex])
      gaEvent({
        name: `max_${isNativeAsset ? 'eth' : 'weth'}`,
      })
      trigger()
    },
    [
      clearErrors,
      isNativeAsset,
      nativeAssetIndex,
      setValue,
      trigger,
      userTokenBalancesAvailable,
      wncgIndex,
    ]
  )

  const setPropAmount = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const inputName = e.currentTarget.value as keyof JoinFormFields
      const currentTokenIndex =
        inputName === 'wncgAmount' ? wncgIndex : nativeAssetIndex

      const propAmounts = calcPropAmounts(amounts, currentTokenIndex)
      setValue(inputName, propAmounts[currentTokenIndex])
      trigger(inputName)

      gaEvent({
        name: `join_proportional_to`,
        params: {
          token: getTokenSymbol(rawPoolTokenAddresses[currentTokenIndex]),
        },
      })
    },
    [
      amounts,
      calcPropAmounts,
      nativeAssetIndex,
      rawPoolTokenAddresses,
      setValue,
      trigger,
      wncgIndex,
    ]
  )

  function togglePriceImpactAgreement(value: boolean) {
    setValue('priceImpactAgreement', value)
  }

  const joinMax = useCallback(() => {
    setValue('wncgAmount', userTokenBalancesAvailable[wncgIndex])
    setValue('ethAmount', userTokenBalancesAvailable[nativeAssetIndex])

    clearErrors()
    trigger()

    gaEvent({
      name: `join_max`,
    })
  }, [
    clearErrors,
    nativeAssetIndex,
    setValue,
    trigger,
    userTokenBalancesAvailable,
    wncgIndex,
  ])

  const joinOpt = useCallback(() => {
    const propMinAmounts = calcOptimizedAmounts(isNativeAsset)
    setValue('wncgAmount', propMinAmounts[wncgIndex])
    setValue('ethAmount', propMinAmounts[nativeAssetIndex])

    clearErrors()
    trigger()

    gaEvent({
      name: `join_optimized`,
    })
  }, [
    calcOptimizedAmounts,
    clearErrors,
    isNativeAsset,
    nativeAssetIndex,
    setValue,
    trigger,
    wncgIndex,
  ])

  const priceImpact = useMemo(
    () => calcPriceImpact(amounts),
    [calcPriceImpact, amounts]
  )

  const highPriceImpact = useMemo(
    () => bnum(priceImpact).gte(HIGH_PRICE_IMPACT),
    [priceImpact]
  )

  const rektPriceImpact = useMemo(
    () => bnum(priceImpact).gte(REKT_PRICE_IMPACT),
    [priceImpact]
  )

  const tokenFiatValues = useMemo(() => {
    return assets.map((address, i) => toFiat(address, amounts[i]) || 0)
  }, [amounts, assets, toFiat])

  const totalFiatValue = useMemo(
    () =>
      tokenFiatValues
        .reduce((total, value) => total.plus(value), bnum(0))
        .toFixed(2) || '0',
    [tokenFiatValues]
  )

  const wncgMaximized = useMemo(
    () =>
      _wncgValue !== '' &&
      bnum(_wncgValue).eq(userTokenBalancesAvailable[wncgIndex]),
    [_wncgValue, userTokenBalancesAvailable, wncgIndex]
  )

  const ethMaximized = useMemo(
    () =>
      _ethValue !== '' &&
      bnum(_ethValue).eq(userTokenBalancesAvailable[nativeAssetIndex]),
    [_ethValue, nativeAssetIndex, userTokenBalancesAvailable]
  )

  const maximized = useMemo(
    () => wncgMaximized && ethMaximized,
    [ethMaximized, wncgMaximized]
  )

  const optimized = useMemo(
    () => amounts.every((amount, i) => bnum(amount).eq(optimizedMinAmounts[i])),
    [amounts, optimizedMinAmounts]
  )

  const showPropButton = useMemo(() => {
    const hasError = !!Object.keys(formState.errors).length

    return {
      wncgAmount: !hasError && _wncgValue === '' && !bnum(_ethValue).isZero(),
      ethAmount: !hasError && _ethValue === '' && !bnum(_wncgValue).isZero(),
    }
  }, [_ethValue, _wncgValue, formState.errors])

  const excessiveAmounts = useMemo(
    () => amounts.some((amount, i) => bnum(amount).gt(userTokenBalances[i])),
    [amounts, userTokenBalances]
  )

  const previewDisabled = useMemo(
    () =>
      !hasAmounts(amounts) ||
      excessiveAmounts ||
      (highPriceImpact && !priceImpactAgreement),
    [amounts, excessiveAmounts, highPriceImpact, priceImpactAgreement]
  )

  const joinDisabled = useMemo(
    () => bnum(priceImpact).gte(REKT_PRICE_IMPACT),
    [priceImpact]
  )

  const maxDisabled = useMemo(
    () => userTokenBalances.every((balance) => bnum(balance).isZero()),
    [userTokenBalances]
  )

  const optDisabled = useMemo(
    () => optimizedMinAmounts.every((amount) => bnum(amount).isZero()),
    [optimizedMinAmounts]
  )

  const openPreviewModal = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()

      if (previewDisabled) return

      addModal({
        category: ModalCategory.JoinPreview,
        props: {
          amounts,
          isNativeAsset,
          priceImpact,
          rektPriceImpact,
          totalFiatValue,
        },
      })
    },
    [
      addModal,
      amounts,
      isNativeAsset,
      previewDisabled,
      priceImpact,
      rektPriceImpact,
      totalFiatValue,
    ]
  )

  return {
    ethMaximized,
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
    togglePriceImpactAgreement,
    totalFiatValue,
    tokenFiatValues,
    wncgIndex,
    wncgMaximized,
  }
}
