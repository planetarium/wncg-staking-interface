import { MouseEvent, useCallback, useMemo } from 'react'
import type { UseFormReturn } from 'react-hook-form'

import { ModalCategory } from 'app/states/modal'
import { configService } from 'services/config'
import { bnum, sanitizeNumber } from 'utils/num'
import {
  useBalances,
  useJoinMath,
  useModal,
  usePoolService,
  useUsd,
} from 'hooks'
import type { JoinFormFields } from './type'

export function useJoinForm(
  isNativeAsset: boolean,
  useFormReturn: UseFormReturn<JoinFormFields>
) {
  const { clearErrors, formState, setValue, trigger, watch } = useFormReturn

  const { balanceFor } = useBalances()
  const { calcPriceImpact, calcPropAmounts, calcOptimizedAmounts } =
    useJoinMath()
  const { addModal } = useModal()
  const { poolTokenAddresses: rawPoolTokenAddresses } = usePoolService()
  const { getFiatValue } = useUsd()

  const poolTokenAddresses = useMemo(
    () =>
      rawPoolTokenAddresses.map((address) => {
        return address === configService.weth && isNativeAsset
          ? configService.nativeAssetAddress
          : address
      }) || [],
    [isNativeAsset, rawPoolTokenAddresses]
  )

  const userTokenBalances = useMemo(
    () =>
      poolTokenAddresses.map((address) => {
        const balance = balanceFor(address)
        if (!isNativeAsset || address !== configService.nativeAssetAddress) {
          return balance
        }
        return Math.max(bnum(balance).minus(0.05).toNumber(), 0).toString()
      }),
    [balanceFor, isNativeAsset, poolTokenAddresses]
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
        setValue('wncgAmount', userTokenBalances[0])
        return
      }
      setValue('ethAmount', userTokenBalances[1])
    },
    [clearErrors, setValue, userTokenBalances]
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
    setValue('wncgAmount', userTokenBalances[0])
    setValue('ethAmount', userTokenBalances[1])
    clearErrors()
  }, [clearErrors, setValue, userTokenBalances])

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
    () => bnum(priceImpact).gte(0.01),
    [priceImpact]
  )

  const totalUsdValue = useMemo(
    () =>
      poolTokenAddresses
        .reduce((total, address, i) => {
          const sumValue = getFiatValue(address, amounts[i])
          return total.plus(sumValue)
        }, bnum(0))
        .toString(),
    [amounts, getFiatValue, poolTokenAddresses]
  )

  const maximized = useMemo(
    () =>
      bnum(wncgValue).eq(userTokenBalances[0]) &&
      !bnum(ethValue).isZero() &&
      bnum(ethValue).eq(userTokenBalances[1]),
    [ethValue, userTokenBalances, wncgValue]
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

  const emptyAmounts = useMemo(
    () => bnum(wncgValue).isZero() && bnum(ethValue).isZero(),
    [ethValue, wncgValue]
  )

  const excessiveAmounts = useMemo(
    () =>
      bnum(wncgValue).gt(userTokenBalances[0]) ||
      bnum(ethValue).gt(userTokenBalances[1]),
    [ethValue, userTokenBalances, wncgValue]
  )

  const previewDisabled = useMemo(
    () =>
      emptyAmounts ||
      excessiveAmounts ||
      (highPriceImpact && !priceImpactAgreement),
    [emptyAmounts, excessiveAmounts, highPriceImpact, priceImpactAgreement]
  )

  const joinDisabled = useMemo(() => bnum(priceImpact).gte(0.2), [priceImpact])

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
          disabled: joinDisabled,
          isNativeAsset,
          priceImpact,
          totalUsdValue,
        },
      })
    },
    [
      addModal,
      amounts,
      isNativeAsset,
      joinDisabled,
      previewDisabled,
      priceImpact,
      totalUsdValue,
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
    totalUsdValue,
  }
}
