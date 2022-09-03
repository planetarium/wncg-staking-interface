import { MouseEvent, useCallback, useMemo } from 'react'
import type { UseFormReturn } from 'react-hook-form'

import { ModalCategory } from 'app/states/modal'
import { HIGH_PRICE_IMPACT, REKT_PRICE_IMPACT } from 'constants/poolLiquidity'
import { configService } from 'services/config'
import { bnum, hasAmounts, sanitizeNumber } from 'utils/num'
import { useExitMath, useModal, usePool, useFiatCurrency } from 'hooks'
import type { ExitFormFields } from './type'

export function useExitForm(useFormReturn: UseFormReturn<ExitFormFields>) {
  const {
    amountExceedsPoolBalance,
    calcAmountsOut,
    calcPriceImpact,
    singleAssetsMaxes,
  } = useExitMath()
  const { toFiat } = useFiatCurrency()
  const { addModal } = useModal()
  const { nativeAssetIndex, poolTokenAddresses } = usePool()

  const { clearErrors, setValue, trigger, watch } = useFormReturn

  const exitType = watch('exitType')
  const _tokenOutAmount = sanitizeNumber(watch('tokenOutAmount'))
  const percent = watch('percent')
  const priceImpactAgreement = watch('priceImpactAgreement')

  const isNativeAsset = exitType === configService.nativeAssetAddress

  const tokenOutIndex = useMemo(() => {
    let tokenOut = exitType
    if (isNativeAsset) tokenOut = configService.weth
    return poolTokenAddresses.findIndex((address) => address === tokenOut)
  }, [exitType, isNativeAsset, poolTokenAddresses])

  const isProportional = exitType === 'all'
  const singleAssetMaxedOut =
    !isProportional &&
    bnum(_tokenOutAmount).eq(singleAssetsMaxes[tokenOutIndex])
  const exactOut = !isProportional && !singleAssetMaxedOut

  const dropdownList = useMemo(
    () => ['all', configService.nativeAssetAddress, ...poolTokenAddresses],
    [poolTokenAddresses]
  )

  const setMaxValue = useCallback(() => {
    setValue('tokenOutAmount', singleAssetsMaxes[tokenOutIndex] || '0')
    clearErrors('tokenOutAmount')
  }, [clearErrors, setValue, singleAssetsMaxes, tokenOutIndex])

  function setExitType(value: string) {
    setValue('exitType', value)
    setValue('percent', 100)
    setValue('tokenOutAmount', '')
    trigger()
  }

  function togglePriceImpactAgreement(value: boolean) {
    setValue('priceImpactAgreement', value)
  }

  const amountsOut = useMemo(() => {
    return calcAmountsOut({
      exactOut,
      isProportional,
      tokenOutIndex,
      tokenOutAmount: _tokenOutAmount,
      percent,
    })
  }, [
    calcAmountsOut,
    exactOut,
    isProportional,
    tokenOutIndex,
    _tokenOutAmount,
    percent,
  ])

  const tokenOutAmount = useMemo(
    () => amountsOut[tokenOutIndex] || '0',
    [amountsOut, tokenOutIndex]
  )

  const priceImpact = useMemo(() => {
    return calcPriceImpact({
      exactOut,
      isProportional,
      tokenOutIndex,
      tokenOutAmount,
      percent,
    })
  }, [
    calcPriceImpact,
    exactOut,
    isProportional,
    tokenOutIndex,
    tokenOutAmount,
    percent,
  ])

  const highPriceImpact = useMemo(
    () => bnum(priceImpact).gte(HIGH_PRICE_IMPACT),
    [priceImpact]
  )

  const rektPriceImpact = useMemo(
    () => bnum(priceImpact).gte(REKT_PRICE_IMPACT),
    [priceImpact]
  )

  const excessiveAmounts = useMemo(
    () => amountsOut.some((amount, i) => bnum(amount).gt(singleAssetsMaxes[i])),
    [amountsOut, singleAssetsMaxes]
  )

  const previewDisabled = useMemo(
    () =>
      !hasAmounts(amountsOut) ||
      excessiveAmounts ||
      (highPriceImpact && !priceImpactAgreement) ||
      amountExceedsPoolBalance(tokenOutIndex, tokenOutAmount),
    [
      amountsOut,
      excessiveAmounts,
      highPriceImpact,
      priceImpactAgreement,
      amountExceedsPoolBalance,
      tokenOutIndex,
      tokenOutAmount,
    ]
  )

  const exitDisabled = useMemo(
    () => bnum(priceImpact).gte(REKT_PRICE_IMPACT),
    [priceImpact]
  )

  const totalFiatValue = useMemo(() => {
    return (
      amountsOut
        .reduce((total, amount, i) => {
          let address = poolTokenAddresses[i]
          if (isNativeAsset && i === nativeAssetIndex) {
            address = configService.nativeAssetAddress
          }
          const sumValue = toFiat(address, amount)
          return total.plus(sumValue)
        }, bnum(0))
        .toString() || '0'
    )
  }, [amountsOut, isNativeAsset, nativeAssetIndex, poolTokenAddresses, toFiat])

  const openPreviewModal = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()

      if (previewDisabled) return

      addModal({
        category: ModalCategory.ExitPreview,
        props: {
          amounts: amountsOut,
          exactOut,
          isNativeAsset,
          isProportional,
          percent,
          priceImpact,
          rektPriceImpact,
          tokenOutAmount,
          tokenOutIndex,
          totalFiatValue,
        },
      })
    },
    [
      addModal,
      amountsOut,
      exactOut,
      isNativeAsset,
      isProportional,
      percent,
      previewDisabled,
      priceImpact,
      rektPriceImpact,
      tokenOutAmount,
      tokenOutIndex,
      totalFiatValue,
    ]
  )

  return {
    amountsOut,
    amountExceedsPoolBalance,
    dropdownList,
    exactOut,
    exitDisabled,
    highPriceImpact,
    isProportional,
    openPreviewModal,
    previewDisabled,
    priceImpact,
    rektPriceImpact,
    setExitType,
    setMaxValue,
    singleAssetsMaxes,
    togglePriceImpactAgreement,
    tokenOutIndex,
    totalFiatValue,
  }
}
