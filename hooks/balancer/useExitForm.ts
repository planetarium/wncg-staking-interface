import { atom } from 'jotai'
import { useMemo } from 'react'
import {
  Control,
  useForm,
  UseFormSetValue,
  UseFormStateReturn,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form'

import { ExitPoolField } from 'config/constants'
import { QUERY_KEYS } from 'config/constants/queryKeys'
import { useBalances, useDebouncedValue, useFiat, useStaking } from 'hooks'
import { bnum } from 'utils/bnum'
import { formatUnits } from 'viem'
import { useQuery } from 'wagmi'
import { useProportionalExit } from './useProportionalExit'

export type ExitFormFields = {
  [ExitPoolField.LiquidityPercent]: `${number}`
  [ExitPoolField.UseNative]: boolean
}

export type UseExitFormReturns = {
  assets: Hash[]
  amountIn: `${number}`
  useNative: boolean
  totalExitFiatValue: `${number}`
  receiveAmounts: `${number}`[]
  control: Control<ExitFormFields>
  setValue: UseFormSetValue<ExitFormFields>
  submitDisabled: boolean
  trigger: UseFormTrigger<ExitFormFields>
  formState: UseFormStateReturn<ExitFormFields>
  watch: UseFormWatch<ExitFormFields>
}

const defaultValues: ExitFormFields = {
  [ExitPoolField.LiquidityPercent]: '100',
  [ExitPoolField.UseNative]: true,
}

export const priceImpactAtom = atom<string>('')

export function useExitForm(): UseExitFormReturns {
  const balanceOf = useBalances()

  const { lpToken, poolTokenAddresses } = useStaking()

  const userLpBalance = balanceOf(lpToken?.address)

  const { control, formState, setValue, trigger, watch } =
    useForm<ExitFormFields>({
      mode: 'onChange',
      defaultValues,
    })

  const percent = watch(ExitPoolField.LiquidityPercent)
  const useNative = watch(ExitPoolField.UseNative)

  const assets = useMemo(() => {
    return poolTokenAddresses
  }, [poolTokenAddresses])

  const amountIn = useMemo(() => {
    return bnum(userLpBalance).times(percent).div(100).toString() as `${number}`
  }, [percent, userLpBalance])

  const submitDisabled = useMemo(() => {
    if (Object.values(formState.errors).length > 0) return true
    return false
  }, [formState])

  const { exitPoolPreview } = useProportionalExit()

  const debouncedAmount = useDebouncedValue(amountIn, 300)

  const { data } = useQuery<`${number}`[]>(
    [QUERY_KEYS.Balancer.Proportional, debouncedAmount],
    async () => {
      const { amountsOut } = await exitPoolPreview(debouncedAmount)
      const receive: `${number}`[] = amountsOut.map(
        ({ amount: _amount, token }) =>
          formatUnits(_amount, token.decimals) as `${number}`
      )
      return receive
    },
    {
      keepPreviousData: true,
      useErrorBoundary: false,
      suspense: false,
    }
  )
  const receiveAmounts = data ?? []

  const toFiat = useFiat()

  const totalExitFiatValue = useMemo(() => {
    return receiveAmounts
      .reduce((acc, amount, i) => {
        return acc.plus(toFiat(amount, poolTokenAddresses[i]))
      }, bnum(0))
      .toString() as `${number}`
  }, [receiveAmounts, poolTokenAddresses, toFiat])

  return {
    assets,
    amountIn,
    totalExitFiatValue,
    useNative,
    control,
    setValue,
    submitDisabled,
    formState,
    trigger,
    watch,
    receiveAmounts,
  }
}
