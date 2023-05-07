import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAtomValue } from 'jotai'

import { fromLaptopAtom } from 'states/screen'
import { bnum } from 'utils/bnum'
import { useAuth, useBalances, useFiat, useStaking } from 'hooks'

export function useStakeForm() {
  const [showPopup, setShowPopup] = useState(false)

  const { isConnected } = useAuth()
  const toFiat = useFiat()
  const { stakedTokenAddress } = useStaking()

  const balanceOf = useBalances()
  const bptBalance = balanceOf(stakedTokenAddress)
  const fromLaptop = useAtomValue(fromLaptopAtom)
  const bptBalanceInFiatValue = toFiat(bptBalance, stakedTokenAddress)

  const { clearErrors, control, formState, setValue, watch } = useForm<{
    stakeAmount: string
  }>({
    mode: 'onChange',
  })

  const rules = useMemo(
    () => ({
      validate: {
        maxAmount: (v: string) =>
          bnum(v).lte(bptBalance) || 'Exceeds wallet balance',
      },
      onBlur() {
        setShowPopup(false)
      },
      onChange(event: ReactHookFormChangeEvent<'stakeAmount'>) {
        const { value } = event.target

        if (bnum(value).gt(0)) setShowPopup(true)
        else setShowPopup(false)

        clearErrors('stakeAmount')
      },
    }),
    [bptBalance, clearErrors]
  )

  const stakeAmount = watch('stakeAmount')

  const isValueEmpty = useMemo(() => bnum(stakeAmount).isZero(), [stakeAmount])

  const submitDisabled = useMemo(
    () =>
      !!isConnected &&
      (Object.keys(formState.errors).length > 0 || isValueEmpty),
    [formState, isConnected, isValueEmpty]
  )

  const inputDisabled = useMemo(() => bnum(bptBalance).isZero(), [bptBalance])

  const placeholder = useMemo(
    () =>
      inputDisabled
        ? `Join pool and get LP tokens`
        : 'Amount of LP tokens to stake',
    [inputDisabled]
  )

  function setMaxValue() {
    setValue('stakeAmount', bptBalance)
    setShowPopup(true)
    clearErrors('stakeAmount')
  }

  function resetForm() {
    setValue('stakeAmount', '')
    clearErrors('stakeAmount')
  }

  function closePopup() {
    setShowPopup(false)
  }

  function togglePopup() {
    setShowPopup((prev) => !prev)
  }

  const enablePopup = !!fromLaptop && !isValueEmpty

  return {
    closePopup,
    clearErrors,
    togglePopup,
    control,
    inputDisabled,
    maxBalance: bptBalance,
    maxBalanceInFiatValue: bptBalanceInFiatValue,
    placeholder,
    resetForm,
    rules,
    setMaxValue,
    showPopup: enablePopup && showPopup,
    stakeAmount,
    submitDisabled,
  }
}
