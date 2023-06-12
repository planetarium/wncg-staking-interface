import { useMemo } from 'react'
import {
  Control,
  RegisterOptions,
  useForm,
  UseFormClearErrors,
} from 'react-hook-form'

import { bnum } from 'utils/bnum'
import { useAuth, useFiat, useResponsive, useStaking } from 'hooks'
import { useFetchUserData, useFetchUserRewards } from 'hooks/queries'

type UnstakeFormFields = {
  unstakeAmount: string
  checked: boolean
}

export type UseUnstakeFormReturns = {
  checked: boolean
  clearErrors: UseFormClearErrors<UnstakeFormFields>
  control: Control<UnstakeFormFields>
  inputDisabled: boolean
  maxBalance: string
  placeholder: string
  resetForm(): void
  rules: Partial<RegisterOptions>
  setMaxValue(): void
  stakedTokenBalance: string
  submitDisabled: boolean
  toggleCheck(value: boolean): void
  totalClaimFiatValue: string
  unstakeAmount: string
}

export function useUnstakeForm(): UseUnstakeFormReturns {
  const { isConnected } = useAuth()
  const toFiat = useFiat()
  const { rewardTokenAddresses } = useStaking()
  const { isMobile } = useResponsive()

  const { stakedTokenBalance = '0' } = useFetchUserData().data ?? {}
  const { earnedTokenRewards = [] } = useFetchUserRewards().data ?? {}

  const { clearErrors, control, formState, resetField, setValue, watch } =
    useForm<UnstakeFormFields>({
      mode: 'onChange',
      defaultValues: {
        unstakeAmount: '',
        checked: true,
      },
    })

  const rules = useMemo(
    () => ({
      validate: {
        maxAmount: (v: string) =>
          bnum(v).lte(stakedTokenBalance) || 'Exceeds withdrawable balance',
      },
      onChange() {
        clearErrors('unstakeAmount')
      },
    }),
    [clearErrors, stakedTokenBalance]
  )

  const unstakeAmount = watch('unstakeAmount')
  const checked = watch('checked')

  const submitDisabled = useMemo(
    () =>
      !!isConnected &&
      (Object.keys(formState.errors).length > 0 ||
        bnum(unstakeAmount).isZero()),
    [formState, isConnected, unstakeAmount]
  )

  const inputDisabled = useMemo(() => {
    console.log(stakedTokenBalance, bnum(stakedTokenBalance).isZero())
    return bnum(stakedTokenBalance).isZero()
  }, [stakedTokenBalance])

  const placeholder = useMemo(
    () =>
      isMobile
        ? `Enter withdrawal amount`
        : 'Enter the LP token amount to withdraw',
    [isMobile]
  )

  const totalClaimFiatValue = useMemo(
    () =>
      earnedTokenRewards
        .reduce((acc, amt, i) => {
          return acc.plus(toFiat(amt, rewardTokenAddresses[i]))
        }, bnum(0))
        .toString(),
    [earnedTokenRewards, rewardTokenAddresses, toFiat]
  )

  function setMaxValue() {
    setValue('unstakeAmount', stakedTokenBalance)
    clearErrors('unstakeAmount')
  }

  function toggleCheck(value: boolean) {
    setValue('checked', value)
  }

  function resetForm() {
    resetField('unstakeAmount', {
      keepError: false,
    })
  }

  return {
    checked,
    clearErrors,
    control,
    inputDisabled,
    maxBalance: stakedTokenBalance,
    placeholder,
    resetForm,
    rules,
    setMaxValue,
    stakedTokenBalance,
    submitDisabled,
    toggleCheck,
    totalClaimFiatValue,
    unstakeAmount,
  }
}
