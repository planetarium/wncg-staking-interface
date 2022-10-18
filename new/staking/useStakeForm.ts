import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useAtomValue } from 'jotai'

import { legacyModeAtom } from 'states/userSettings'
import { gaEvent } from 'lib/gtag'
import { networkChainId } from 'utils/network'
import { bnum } from 'utils/num'
import { useAccount, useBalances, useNetwork } from 'hooks'

export function useStakeForm() {
  const { isConnected } = useAccount()
  const { bptBalance } = useBalances()
  const { chain } = useNetwork()

  const legacyMode = useAtomValue(legacyModeAtom)
  const networkMismatch = chain && chain.id !== networkChainId

  const { clearErrors, control, formState, resetField, setValue, watch } =
    useForm<{
      stakeAmount: string
    }>({
      mode: 'onBlur',
    })

  const rules = useMemo(
    () => ({
      required: 'Please enter valid amount',
      validate: {
        maxAmount: (v: string) =>
          bnum(v).lte(bptBalance) || 'You don’t have enough balance',
        minAmount: (v: string) =>
          bnum(v).gte(1e-18) ||
          'Please enter the amount bigger than or equal to 1e-18',
      },
      onChange() {
        clearErrors('stakeAmount')
      },
    }),
    [bptBalance, clearErrors]
  )

  const stakeAmount = watch('stakeAmount')

  const disabled = legacyMode
  const submitDisabled = useMemo(
    () =>
      isConnected &&
      (networkMismatch ||
        Object.keys(formState.errors).length > 0 ||
        bnum(stakeAmount).isZero()),
    [formState.errors, isConnected, networkMismatch, stakeAmount]
  )

  function setMaxValue() {
    setValue('stakeAmount', bptBalance)
    clearErrors('stakeAmount')
    gaEvent({
      name: 'stake_max',
    })
  }

  function resetForm() {
    resetField('stakeAmount', {
      keepError: false,
    })
  }

  return {
    clearErrors,
    control,
    disabled,
    resetForm,
    rules,
    setMaxValue,
    submitDisabled,
  }
}
