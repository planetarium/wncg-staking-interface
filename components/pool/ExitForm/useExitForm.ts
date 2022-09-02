import { MouseEvent, useCallback, useMemo } from 'react'
import type { UseFormReturn } from 'react-hook-form'

import { ModalCategory } from 'app/states/modal'
import { HIGH_PRICE_IMPACT, REKT_PRICE_IMPACT } from 'constants/poolLiquidity'
import { configService } from 'services/config'
import { bnum } from 'utils/num'
import { useExitMath, useModal, usePool, useFiatCurrency } from 'hooks'
import type { ExitFormFields } from './type'

export function useExitForm(useFormReturn: UseFormReturn<ExitFormFields>) {
  const { addModal } = useModal()
  const { toFiat } = useFiatCurrency()
  const { poolTokenAddresses } = usePool()

  const { clearErrors, setValue, trigger, watch } = useFormReturn

  const exitType = watch('exitType')
  const exitAmount = watch('exitAmount')
  const percentage = watch('percentage')
  const priceImpactAgreement = watch('priceImpactAgreement')

  const isProportional = exitType === 'all'
  const exactOut = !isProportional

  const tokenOutIndex = useMemo(() => {
    if (exitType === 'all') return 0

    let tokenOut = exitType
    if (exitType === configService.nativeAssetAddress) {
      tokenOut = configService.weth
    }

    return poolTokenAddresses.findIndex((address) => address === tokenOut)
  }, [exitType, poolTokenAddresses])

  const {
    amountExceedsPoolBalance,
    amountsOut,
    bptIn,
    priceImpact,
    singleAssetsMaxes,
  } = useExitMath(isProportional, tokenOutIndex, exitAmount)

  const dropdownList = useMemo(
    () => ['all', configService.nativeAssetAddress, ...poolTokenAddresses],
    [poolTokenAddresses]
  )

  const setMaxValue = useCallback(() => {
    setValue('exitAmount', singleAssetsMaxes[tokenOutIndex])
    clearErrors('exitAmount')
  }, [clearErrors, setValue, singleAssetsMaxes, tokenOutIndex])

  function setExitType(value: string) {
    setValue('exitType', value)
    setValue('percentage', 100)

    if (value === 'all') {
      setValue('exitAmount', '')
    }

    trigger()
  }

  function togglePriceImpactAgreement(value: boolean) {
    setValue('priceImpactAgreement', value)
  }

  const highPriceImpact = useMemo(
    () => bnum(priceImpact).gte(HIGH_PRICE_IMPACT),
    [priceImpact]
  )

  const previewDisabled = useMemo(
    () =>
      (exactOut && bnum(exitAmount).isZero()) ||
      (!exactOut && bnum(percentage).isZero()) ||
      amountExceedsPoolBalance ||
      (highPriceImpact && !priceImpactAgreement),
    [
      amountExceedsPoolBalance,
      exactOut,
      exitAmount,
      highPriceImpact,
      percentage,
      priceImpactAgreement,
    ]
  )

  const exitDisabled = useMemo(
    () => bnum(priceImpact).gte(REKT_PRICE_IMPACT),
    [priceImpact]
  )

  const totalFiatValue = useMemo(() => {
    if (exactOut) {
      return (
        amountsOut
          .reduce((total, amount, i) => {
            if (i !== tokenOutIndex) {
              return total
            }
            const sumValue = toFiat(poolTokenAddresses[i], amount)
            return total.plus(sumValue)
          }, bnum(0))
          .toString() || '0'
      )
    }

    return (
      amountsOut
        .reduce((total, amount, i) => {
          const sumValue = toFiat(poolTokenAddresses[i], amount)
          return total.plus(sumValue)
        }, bnum(0))
        .toString() || '0'
    )
  }, [amountsOut, exactOut, poolTokenAddresses, toFiat, tokenOutIndex])

  const openPreviewModal = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()

      if (previewDisabled) return

      addModal({
        category: ModalCategory.ExitPreview,
        props: {
          amounts: amountsOut,
          disabled: exitDisabled,
          isProportional,
          bptIn,
          priceImpact,
          totalFiatValue,
        },
      })
    },
    [
      addModal,
      amountsOut,
      bptIn,
      exitDisabled,
      isProportional,
      previewDisabled,
      priceImpact,
      totalFiatValue,
    ]
  )

  return {
    amountsOut,
    amountExceedsPoolBalance,
    bptIn,
    dropdownList,
    exactOut,
    exitDisabled,
    highPriceImpact,
    openPreviewModal,
    previewDisabled,
    priceImpact,
    setExitType,
    setMaxValue,
    singleAssetsMaxes,
    togglePriceImpactAgreement,
    tokenOutIndex,
    totalFiatValue,
  }
}
