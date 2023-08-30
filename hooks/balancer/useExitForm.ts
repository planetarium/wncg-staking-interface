import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react'
import {
  Control,
  useForm,
  UseFormClearErrors,
  UseFormResetField,
  UseFormSetValue,
  UseFormStateReturn,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form'

import { LiquidityFieldType } from 'config/constants'
import {
  HIGH_PRICE_IMPACT,
  REKT_PRICE_IMPACT,
} from 'config/constants/liquidityPool'
import { bnum } from 'utils/bnum'
import { useAuth, useBalances, useChain, useFiat, useStaking } from 'hooks'

import { NATIVE_CURRENCY_ADDRESS } from 'config/constants/addresses'
import { isSameAddress } from '@balancer-labs/sdk'
import { useQuery } from 'wagmi'
import { QUERY_KEYS } from 'config/constants/queryKeys'
import { useExactInExit } from './useExactInExit'
import { atom, useAtomValue } from 'jotai'

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
  tokenOutAmount: string
  amountOut: string
  amountsOut: string[] // 2개이거나 1개이거나
  bptOutInFiatValue: string
  exitType: Hash | null
  // totalExitFiatValue: string
  bptOutPcnt: string
  isNative: boolean
  setValue: UseFormSetValue<ExitFormFields>
  submitDisabled: boolean
  tokenOutIndex: number
  singleExitMaxAmounts: string[]
  priceImpact: string
  trigger: UseFormTrigger<ExitFormFields>
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

export const priceImpactAtom = atom<string>('')

export function useExitForm(): UseExitFormReturns {
  const { account } = useAuth()
  const balanceOf = useBalances()
  const { nativeCurrency } = useChain()
  const toFiat = useFiat()
  const { queryExactOutExitMaxAmounts } = useExactInExit()

  const { lpToken, poolTokenAddresses } = useStaking()

  const userLpBalance = balanceOf(lpToken?.address)

  const {
    clearErrors,
    control,
    formState,
    reset,
    resetField,
    setValue,
    trigger,
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

  const priceImpact = useAtomValue(priceImpactAtom)

  const assets = useMemo(() => {
    if (exitType == null) return poolTokenAddresses
    return [exitType]
  }, [exitType, poolTokenAddresses])

  const singleExitTokenOutIndex = useMemo(() => {
    if (exitType == null) return -1
    return poolTokenAddresses.findIndex((addr) => {
      const match =
        exitType !== NATIVE_CURRENCY_ADDRESS
          ? exitType
          : nativeCurrency.wrappedTokenAddress
      return isSameAddress(addr, match)
    })
  }, [exitType, nativeCurrency.wrappedTokenAddress, poolTokenAddresses])

  const bptIn = useMemo(() => {
    if (exitType == null) {
      return bnum(userLpBalance).times(bptOutPcnt).div(100).toString()
    }
    return '0'
  }, [bptOutPcnt, exitType, userLpBalance])

  const exitAmountInFiatValue = toFiat(bptIn, lpToken?.address)

  const amountsOut = useMemo(() => {
    if (exitType == null) return []
    return [tokenOutAmount]
  }, [exitType, tokenOutAmount])

  const submitDisabled = useMemo(() => {
    if (Object.values(formState.errors).length > 0) return true
    if (exitType != null) {
      if (bnum(tokenOutAmount).isZero()) return true
      return (
        bnum(priceImpact).gt(REKT_PRICE_IMPACT) ||
        (bnum(priceImpact).gt(HIGH_PRICE_IMPACT) && !priceImpactAgreement)
      )
    }
    return false
  }, [
    exitType,
    formState.errors,
    priceImpact,
    priceImpactAgreement,
    tokenOutAmount,
  ])

  const setMaxValue = useCallback(
    (e: MouseEvent<HTMLButtonElement>): void => {
      if (exitType == null) return

      // setValue(
      //   LiquidityFieldType.ExitAmount,
      //   singleExitMaxAmounts[singleExitTokenOutIndex] ?? ''
      // )
      clearErrors(LiquidityFieldType.ExitAmount)
    },
    [clearErrors, exitType]
  )

  const resetFields = useCallback(() => {
    reset(defaultValues)
  }, [reset])

  const { data: maxExitAmounts = [] } = useQuery(
    [QUERY_KEYS.Balancer.MaxExitAmounts, account, userLpBalance],
    () => queryExactOutExitMaxAmounts(),
    {
      staleTime: 30 * 1_000,
      suspense: false,
    }
  )

  return {
    assets,
    bptIn,
    clearErrors,
    control,
    exitType,
    tokenOutAmount,
    amountOut: exitType == null ? '0' : tokenOutAmount,
    amountsOut,
    bptOutInFiatValue: exitAmountInFiatValue,
    bptOutPcnt,
    isNative,
    setValue,
    tokenOutIndex: singleExitTokenOutIndex,
    singleExitMaxAmounts: maxExitAmounts,
    submitDisabled,
    formState,
    resetField,
    resetFields,
    priceImpact,
    trigger,
    setMaxValue,
    // totalExitFiatValue,
    watch,
  }
}
