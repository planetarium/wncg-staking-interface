import { useCallback, useMemo, useState } from 'react'
import { Control, FieldValues, useForm } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import styles from '../styles/UnstakeForm.module.scss'

import { ModalCategory } from 'app/states/modal'
import { TxAction } from 'services/transaction'
import { gaEvent } from 'lib/gtag'
import { handleError } from 'utils/error'
import { bnum } from 'utils/num'
import {
  useModal,
  usePool,
  useRewards,
  useStakedBalance,
  useUnstake,
} from 'hooks'
import { formTransition, motionVariants, TabId, TabPanelId } from '../constants'

import { Button } from 'components/Button'
import { Checkbox } from 'components/Checkbox'
import { InputGroup } from '../InputGroup'
import { UnstakeFormBlock } from './Block'

const minAmount = 1e-18

type UnstakeFormProps = {
  disabled: boolean
}

export function UnstakeForm({ disabled }: UnstakeFormProps) {
  const [checked, setChecked] = useState(false)
  const [loading, setLoading] = useState(false)

  const { addModal } = useModal()
  const { poolTokenName } = usePool()
  const { rewardTokenSymbols } = useRewards()
  const { stakedBalance } = useStakedBalance()
  const { withdraw } = useUnstake()

  const { clearErrors, control, setValue, watch } = useForm({
    mode: 'onBlur',
  })
  const unstakeAmountValue = watch('unstakeAmount')
  const rules = useMemo(
    () =>
      disabled
        ? {}
        : {
            required: 'Please enter valid amount',
            validate: {
              maxAmount: (v: string) =>
                bnum(v).lte(stakedBalance) ||
                'You cannot withdraw more than the staked amount',
              minAmount: (v: string) =>
                bnum(v).gte(minAmount) ||
                'Please enter the amount bigger than or equal to 1e-18',
            },
            onChange: () => clearErrors('unstakeAmount'),
          },
    [clearErrors, disabled, stakedBalance]
  )

  const withdrawalDisabled = disabled || bnum(unstakeAmountValue).isZero()

  function setMaxValue() {
    setValue('unstakeAmount', stakedBalance)
    clearErrors('unstakeAmount')
    gaEvent({
      name: 'unstake_max',
    })
  }

  const clearInput = useCallback(() => {
    setValue('unstakeAmount', '')
  }, [setValue])

  function handleCheck(value: boolean) {
    setChecked(value)
  }

  function resetForm() {
    clearInput()
    setChecked(false)
  }

  async function handleWithdraw() {
    if (disabled) {
      return
    }

    if (checked) {
      addModal({
        category: ModalCategory.WithdrawPreview,
        props: {
          amount: unstakeAmountValue,
          resetForm,
        },
      })
      return
    }

    setLoading(true)
    gaEvent({
      name: 'withdraw',
    })
    try {
      await withdraw(unstakeAmountValue, false)
      resetForm()
      setLoading(false)
    } catch (error) {
      setLoading(false)
      handleError(error, TxAction.Withdraw)
    }
  }

  return (
    <motion.section
      className={styles.unstakeForm}
      id={TabPanelId.Unstake}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={formTransition}
      variants={motionVariants}
      aria-labelledby={TabId.Unstake}
      role="tabpanel"
    >
      <h1 className="hidden">Stake</h1>

      <InputGroup
        name="unstakeAmount"
        control={control as any as Control<FieldValues, 'any'>}
        label={`Staked ${poolTokenName}`}
        maxAmount={stakedBalance}
        rules={rules}
        setMaxValue={setMaxValue}
        disabled={disabled}
      />

      <div className={styles.checkboxGroup}>
        <Checkbox
          id="withdrawAndClaim"
          checked={checked}
          onChange={handleCheck}
          disabled={disabled}
        />
        <label htmlFor="withdrawAndClaim">
          Claim all {rewardTokenSymbols.join(' & ')} rewards
        </label>
      </div>

      <Button
        size="large"
        onClick={handleWithdraw}
        fullWidth
        disabled={withdrawalDisabled || loading}
        loading={loading}
      >
        Withdraw
      </Button>

      <AnimatePresence>{disabled && <UnstakeFormBlock />}</AnimatePresence>
    </motion.section>
  )
}
