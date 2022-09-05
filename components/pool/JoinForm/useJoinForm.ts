import { MouseEvent, useCallback, useMemo } from 'react'
import type { UseFormReturn } from 'react-hook-form'

import { ModalCategory } from 'app/states/modal'
import { HIGH_PRICE_IMPACT, REKT_PRICE_IMPACT } from 'constants/poolLiquidity'
import { configService } from 'services/config'
import { bnum, hasAmounts, sanitizeNumber } from 'utils/num'
import { useJoinMath, useModal, usePool, useFiatCurrency } from 'hooks'
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
  const { nativeAssetIndex, poolTokenAddresses: rawPoolTokenAddresses } =
    usePool()
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

  const userTokenBalances = useMemo(
    () => calcUserPoolTokenBalances(isNativeAsset),
    [calcUserPoolTokenBalances, isNativeAsset]
  )

  const userTokenBalancesAvailable = useMemo(
    () => calcUserPoolTokenBalancesAvailable(isNativeAsset),
    [calcUserPoolTokenBalancesAvailable, isNativeAsset]
  )

  const ethValue = sanitizeNumber(watch('ethAmount'))
  const wncgValue = sanitizeNumber(watch('wncgAmount'))
  const priceImpactAgreement = watch('priceImpactAgreement')
  const amounts = useMemo(() => [wncgValue, ethValue], [ethValue, wncgValue])

  const optimizedMinAmounts = calcOptimizedAmounts(isNativeAsset)

  const setMaxValue = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const { value: inputName } = e.currentTarget as typeof e.currentTarget & {
        value: keyof JoinFormFields
      }
      clearErrors(inputName)

      if (inputName === 'wncgAmount') {
        setValue('wncgAmount', userTokenBalancesAvailable[0])
        return
      }
      setValue('ethAmount', userTokenBalancesAvailable[1])
    },
    [clearErrors, setValue, userTokenBalancesAvailable]
  )

  const setPropAmount = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const inputName = e.currentTarget.value as keyof JoinFormFields
      const currentTokenIndex = inputName === 'wncgAmount' ? 0 : 1

      const propAmounts = calcPropAmounts(amounts, currentTokenIndex)
      setValue(inputName, propAmounts[currentTokenIndex])
      trigger(inputName)
    },
    [amounts, calcPropAmounts, setValue, trigger]
  )

  function togglePriceImpactAgreement(value: boolean) {
    setValue('priceImpactAgreement', value)
  }

  const joinMax = useCallback(() => {
    setValue('wncgAmount', userTokenBalancesAvailable[0])
    setValue('ethAmount', userTokenBalancesAvailable[1])
    clearErrors()
  }, [clearErrors, setValue, userTokenBalancesAvailable])

  const joinOpt = useCallback(() => {
    const propMinAmounts = calcOptimizedAmounts(isNativeAsset)

    setValue('wncgAmount', propMinAmounts[0])
    setValue('ethAmount', propMinAmounts[1])
    trigger()
  }, [calcOptimizedAmounts, isNativeAsset, setValue, trigger])

  const priceImpact = useMemo(
    () => calcPriceImpact([wncgValue, ethValue]),
    [ethValue, calcPriceImpact, wncgValue]
  )

  const highPriceImpact = useMemo(
    () => bnum(priceImpact).gte(HIGH_PRICE_IMPACT),
    [priceImpact]
  )

  const rektPriceImpact = useMemo(
    () => bnum(priceImpact).gte(REKT_PRICE_IMPACT),
    [priceImpact]
  )

  const totalFiatValue = useMemo(
    () =>
      assets
        .reduce((total, address, i) => {
          const sumValue = toFiat(address, amounts[i])
          return total.plus(sumValue)
        }, bnum(0))
        .toString(),
    [amounts, toFiat, assets]
  )

  const maximized = useMemo(
    () =>
      bnum(wncgValue).eq(userTokenBalancesAvailable[0]) &&
      !bnum(ethValue).isZero() &&
      bnum(ethValue).eq(userTokenBalancesAvailable[1]),
    [ethValue, userTokenBalancesAvailable, wncgValue]
  )

  const optimized = useMemo(
    () => amounts.every((amount, i) => bnum(amount).eq(optimizedMinAmounts[i])),
    [amounts, optimizedMinAmounts]
  )

  const showPropButton = useMemo(() => {
    const hasError = !!Object.keys(formState.errors).length
    const wncg = bnum(wncgValue)
    const eth = bnum(ethValue)

    return {
      wncgAmount: !hasError && wncg.isZero() && !eth.isZero(),
      ethAmount: !hasError && eth.isZero() && !wncg.isZero(),
    }
  }, [ethValue, formState, wncgValue])

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
  }
}
