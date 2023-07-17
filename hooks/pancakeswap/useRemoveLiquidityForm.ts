import { useCallback, useMemo } from 'react'
import {
  Control,
  useForm,
  UseFormClearErrors,
  UseFormResetField,
  UseFormSetValue,
  UseFormStateReturn,
  UseFormWatch,
} from 'react-hook-form'

import { RemoveLiquidityField } from 'config/constants'
import { bnum } from 'utils/bnum'
import {
  useBalances,
  useChain,
  useDebouncedValue,
  useFiat,
  useStaking,
} from 'hooks'
import { useRemoveLiquidityMath } from './useRemoveLiquidityMath'

export type RemoveLiquidityForm = {
  [RemoveLiquidityField.Percent]: string
  [RemoveLiquidityField.UseNative]: boolean
  [RemoveLiquidityField.Signature]?: Signature
}

export type UseRemoveLiquidityFormReturns = {
  amountsOut: string[]
  amountsOutFiatValue: string[]
  amountsOutFiatValueSum: string
  assets: Hash[]
  clearErrors: UseFormClearErrors<RemoveLiquidityForm>
  control: Control<RemoveLiquidityForm>
  formState: UseFormStateReturn<RemoveLiquidityForm>
  isNative: boolean
  lpAmountOut: string
  lpAmountOutFiatValue: string
  pcntOut: string
  resetField: UseFormResetField<RemoveLiquidityForm>
  resetFields(): void
  setValue: UseFormSetValue<RemoveLiquidityForm>
  signature?: Signature
  submitDisabled: boolean
  watch: UseFormWatch<RemoveLiquidityForm>
}

const DEFAULT_VALUES: RemoveLiquidityForm = {
  [RemoveLiquidityField.Percent]: '100',
  [RemoveLiquidityField.UseNative]: true,
  [RemoveLiquidityField.Signature]: undefined,
}

export function useRemoveLiquidityForm(): UseRemoveLiquidityFormReturns {
  const balanceOf = useBalances()
  const { nativeCurrency } = useChain()
  const toFiat = useFiat()
  const { lpToken, poolTokenAddresses, shouldReversePoolTokenOrderOnDisplay } =
    useStaking()
  const calcPropAmountsOut = useRemoveLiquidityMath()

  const userLpAmount = balanceOf(lpToken?.address)

  const {
    clearErrors,
    control,
    formState,
    reset,
    resetField,
    setValue,
    watch,
  } = useForm<RemoveLiquidityForm>({
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  })

  const pcntOut = watch(RemoveLiquidityField.Percent)
  const isNative = watch(RemoveLiquidityField.UseNative)
  const signature = watch(RemoveLiquidityField.Signature)

  const ethIndex = shouldReversePoolTokenOrderOnDisplay ? 0 : 1

  const assets = useMemo(() => {
    if (!isNative) return poolTokenAddresses

    return poolTokenAddresses.map((addr, i) =>
      i === ethIndex ? nativeCurrency.address : addr
    )
  }, [ethIndex, isNative, nativeCurrency.address, poolTokenAddresses])

  const lpAmountOut = useMemo(
    () => bnum(userLpAmount).times(pcntOut).div(100).toFixed(18, 3),
    [pcntOut, userLpAmount]
  )

  const lpAmountOutFiatValue = useMemo(
    () => toFiat(lpAmountOut, lpToken?.address),
    [lpAmountOut, lpToken?.address, toFiat]
  )

  const debouncedPcnt = useDebouncedValue(pcntOut, 500)

  const amountsOut = useMemo(
    () => calcPropAmountsOut(debouncedPcnt),
    [calcPropAmountsOut, debouncedPcnt]
  )

  const amountsOutFiatValue = useMemo(
    () => poolTokenAddresses.map((addr, i) => toFiat(amountsOut[i], addr)),
    [amountsOut, poolTokenAddresses, toFiat]
  )

  const amountsOutFiatValueSum = useMemo(
    () =>
      amountsOutFiatValue
        .reduce((acc, amt) => acc.plus(amt), bnum(0))
        .toString() ?? '0',
    [amountsOutFiatValue]
  )

  const submitDisabled = useMemo(
    () =>
      !signature ||
      amountsOut.every((a) => bnum(a).isZero()) ||
      Object.values(formState.errors).length > 0,
    [amountsOut, formState.errors, signature]
  )

  const resetFields = useCallback(() => {
    reset(DEFAULT_VALUES)
  }, [reset])

  return {
    amountsOut,
    amountsOutFiatValue,
    amountsOutFiatValueSum,
    assets,
    clearErrors,
    control,
    formState,
    isNative,
    lpAmountOut,
    lpAmountOutFiatValue,
    pcntOut,
    resetField,
    resetFields,
    setValue,
    signature,
    submitDisabled,
    watch,
  }
}
