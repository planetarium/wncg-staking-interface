import { useCallback, useMemo } from 'react'
import type { MouseEvent } from 'react'
import { useForm } from 'react-hook-form'
import { useSetAtom } from 'jotai'

import { optimizeErrorAtom } from 'states/form'
import { configService } from 'services/config'
import { bnum } from 'utils/num'
import { useBalances, useFiatCurrency, usePool } from 'hooks'
import { useJoinMath } from './useJoinMath'

export type JoinFormFields = {
  tokenAmount: string
  etherAmount: string
  etherType: string
  priceImpactAgreement: boolean
}

export function useJoinForm() {
  const { balanceFor } = useBalances()
  const { toFiat } = useFiatCurrency()
  const { calcPriceImpact, calcOptimizedAmounts } = useJoinMath()
  const {
    nativeAssetIndex,
    poolTokenAddresses,
    poolTokenDecimals,
    poolTokenWeights,
  } = usePool()

  const { clearErrors, control, formState, resetField, setValue, watch } =
    useForm<JoinFormFields>({
      mode: 'onChange',
      defaultValues: {
        tokenAmount: '',
        etherAmount: '',
        etherType: configService.nativeAssetAddress,
        priceImpactAgreement: false,
      },
    })

  const setOptError = useSetAtom(optimizeErrorAtom)

  const fieldList = useMemo(
    () =>
      poolTokenAddresses.map((_, i) => {
        if (i === nativeAssetIndex) return 'etherAmount'
        return 'tokenAmount'
      }),
    [nativeAssetIndex, poolTokenAddresses]
  )

  const joinAmounts = poolTokenAddresses.map((_, i) => {
    return watch(fieldList[i])
  })

  const currentEtherType = watch('etherType')
  const isNativeAsset = currentEtherType === configService.nativeAssetAddress
  const priceImpactAgreement = watch('priceImpactAgreement')

  const assets = useMemo(
    () =>
      poolTokenAddresses.map((address, i) => {
        if (!isNativeAsset || i !== nativeAssetIndex) return address
        return configService.nativeAssetAddress
      }),
    [isNativeAsset, nativeAssetIndex, poolTokenAddresses]
  )

  const balances = useMemo(
    () => assets.map((address) => balanceFor(address)),
    [assets, balanceFor]
  )

  const balancesInFiatValue = useMemo(
    () => balances.map((balance, i) => toFiat(poolTokenAddresses[i], balance)),
    [balances, poolTokenAddresses, toFiat]
  )

  const availableBalances = useMemo(
    () =>
      balances.map((balance, i) => {
        if (!isNativeAsset || i !== nativeAssetIndex) return balance
        return Math.max(bnum(balance).minus(0.05).toNumber(), 0).toString()
      }),
    [balances, isNativeAsset, nativeAssetIndex]
  )

  const weights = useMemo(
    () => poolTokenWeights.map((weight) => bnum(weight).times(100).toNumber()),
    [poolTokenWeights]
  )

  const optimizedAmounts = useMemo(
    () => calcOptimizedAmounts(availableBalances),
    [availableBalances, calcOptimizedAmounts]
  )

  const optimized = useMemo(
    () =>
      joinAmounts.every(
        (amount, i) =>
          bnum(amount).gt(0) && bnum(amount).eq(optimizedAmounts[i])
      ),
    [joinAmounts, optimizedAmounts]
  )

  const optimizeDisabled = useMemo(
    () => balances.some((balance) => bnum(balance).isZero()),
    [balances]
  )

  const resetDisabled = useMemo(
    () => joinAmounts.every((amount) => !amount),
    [joinAmounts]
  )

  const emptyBalances = useMemo(
    () => balances.map((balance) => bnum(balance).isZero()),
    [balances]
  )

  const ethWarning = useMemo(() => {
    const etherAmount = joinAmounts[nativeAssetIndex]
    if (!isNativeAsset) return false
    if (!etherAmount) return false
    if (!!formState.errors.etherAmount?.message) return false
    if (bnum(etherAmount).gte(availableBalances[nativeAssetIndex])) return true
    return false
  }, [
    availableBalances,
    formState.errors.etherAmount?.message,
    isNativeAsset,
    joinAmounts,
    nativeAssetIndex,
  ])

  const rules = useMemo(
    () =>
      fieldList.map((field, i) => {
        return {
          validate: {
            maxAmount: (v: string) =>
              bnum(v).lte(balances[i]) || `Exceeds wallet balance`,
          },
          onChange() {
            setOptError(false)
            clearErrors(field)
          },
        }
      }),
    [balances, clearErrors, fieldList, setOptError]
  )

  const priceImpact = useMemo(
    () => calcPriceImpact(joinAmounts),
    [calcPriceImpact, joinAmounts]
  )

  const totalJoinAmountsInFiatValue = useMemo(
    () =>
      assets
        .reduce(
          (total, address, i) =>
            total.plus(toFiat(address, bnum(joinAmounts[i]).toString())),
          bnum(0)
        )
        .toFixed(2) || '0',
    [assets, joinAmounts, toFiat]
  )

  const resetForm = useCallback(() => {
    fieldList.forEach((field) =>
      resetField(field, {
        keepError: false,
      })
    )
  }, [fieldList, resetField])

  const setMaxValue = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const fieldName = e.currentTarget.previousElementSibling?.getAttribute(
        'name'
      ) as 'etherAmount' | 'tokenAmount'
      if (!fieldName) return

      const matchIndex = fieldList.indexOf(fieldName)

      setValue(fieldName, availableBalances[matchIndex])
      clearErrors(fieldName)
    },
    [availableBalances, clearErrors, fieldList, setValue]
  )

  const selectEther = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      setValue('etherType', e.currentTarget.value)
      setValue('etherAmount', '')
      setOptError(false)
    },
    [setOptError, setValue]
  )

  const optimize = useCallback(() => {
    if (optimizeDisabled) return
    fieldList.forEach((field, i) =>
      setValue(field, optimizedAmounts[i].toString())
    )
    clearErrors()
  }, [clearErrors, fieldList, optimizeDisabled, optimizedAmounts, setValue])

  const updateValue = useCallback(
    (fieldName: 'etherAmount' | 'tokenAmount', value: string) => {
      setValue(fieldName, value)
      clearErrors(fieldName)
    },
    [clearErrors, setValue]
  )

  const togglePriceImpactAgreement = useCallback(
    (value: boolean) => setValue('priceImpactAgreement', value),
    [setValue]
  )

  return {
    assets,
    balances,
    balancesInFiatValue,
    control,
    currentEtherType,
    emptyBalances,
    ethWarning,
    fieldList,
    errors: formState.errors,
    joinAmounts,
    optimize,
    optimized,
    poolTokenAddresses,
    poolTokenDecimals,
    priceImpact,
    priceImpactAgreement,
    resetDisabled,
    resetForm,
    rules,
    selectEther,
    setMaxValue,
    togglePriceImpactAgreement,
    totalJoinAmountsInFiatValue,
    updateValue,
    weights,
  }
}
