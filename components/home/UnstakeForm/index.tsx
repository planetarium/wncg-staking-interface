import { useCallback, useMemo, useState } from 'react'
import { Control, FieldValues, useForm } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import styles from '../styles/UnstakeForm.module.scss'

import { ModalCategory } from 'app/states/modal'
import { getStakedBalance } from 'app/states/stake'
import { TransactionAction } from 'app/states/transaction'
import { gaEvent } from 'lib/gtag'
import { handleError } from 'utils/error'
import Decimal, { sanitizeNumber } from 'utils/num'
import { useAppSelector, useModal, useUnstake } from 'hooks'
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
  const { withdraw } = useUnstake()

  const stakedBalance = useAppSelector(getStakedBalance)

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
                new Decimal(sanitizeNumber(v)).lte(stakedBalance) ||
                'You cannot withdraw more than the staked amount',
              minAmount: (v: string) =>
                new Decimal(sanitizeNumber(v)).gte(minAmount) ||
                'Please enter the amount bigger than or equal to 1e-18',
            },
            onChange: () => clearErrors('unstakeAmount'),
          },
    [clearErrors, disabled, stakedBalance]
  )

  const withdrawalDisabled =
    disabled || new Decimal(sanitizeNumber(unstakeAmountValue)).isZero()

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
      await withdraw(unstakeAmountValue)
      resetForm()
      setLoading(false)
    } catch (error) {
      setLoading(false)
      handleError(error, TransactionAction.Withdraw)
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
        label="Staked 20WETH-80WNCG"
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
        <label htmlFor="withdrawAndClaim">Claim all BAL & WNCG rewards</label>
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
