import { memo, useMemo } from 'react'
import { Control, FieldValues, useForm } from 'react-hook-form'
import { useRecoilValue } from 'recoil'
import { motion } from 'framer-motion'
import styles from './styles/StakeForm.module.scss'

import { networkMismatchState } from 'app/states/error'
import { gaEvent } from 'lib/gtag'
import { bnum } from 'utils/num'
import { useBalances, usePool } from 'hooks'
import { formTransition, motionVariants, TabId, TabPanelId } from './constants'

import { EstimatedEarn } from './EstimatedEarn'
import { InputGroup } from './InputGroup'
import { StakeSubmit } from './StakeSubmit'

const minAmount = 1e-18

function StakeForm() {
  const networkMismatch = useRecoilValue(networkMismatchState)
  const { bptBalance } = useBalances()
  const { poolTokenName } = usePool()

  const { clearErrors, control, formState, setValue, watch } = useForm<{
    stakeAmount: string
  }>({
    mode: 'onBlur',
  })
  const stakeAmountValue = watch('stakeAmount')
  const disabled =
    networkMismatch ||
    Object.keys(formState.errors).length > 0 ||
    bnum(stakeAmountValue).isZero()

  const rules = useMemo(
    () => ({
      required: 'Please enter valid amount',
      validate: {
        maxAmount: (v: string) =>
          bnum(v).lte(bptBalance) || 'You don’t have enough balance',
        minAmount: (v: string) =>
          bnum(v).gte(minAmount) ||
          'Please enter the amount bigger than or equal to 1e-18',
      },
      onChange: () => {
        clearErrors('stakeAmount')
      },
    }),
    [bptBalance, clearErrors]
  )

  function setMaxValue() {
    setValue('stakeAmount', bptBalance)
    clearErrors('stakeAmount')
    gaEvent({
      name: 'stake_max',
    })
  }

  function clearInput() {
    setValue('stakeAmount', '')
  }

  return (
    <motion.section
      className={styles.stakeForm}
      id={TabPanelId.Stake}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={formTransition}
      variants={motionVariants}
      aria-labelledby={TabId.Stake}
      role="tabpanel"
    >
      <h1 className="hidden">Stake</h1>

      <InputGroup
        name="stakeAmount"
        control={control as any as Control<FieldValues, 'any'>}
        label={poolTokenName}
        maxAmount={bptBalance}
        rules={rules}
        setMaxValue={setMaxValue}
      />
      <EstimatedEarn amount={stakeAmountValue} />
      <StakeSubmit
        amount={stakeAmountValue}
        clearInput={clearInput}
        disabled={disabled}
      />
    </motion.section>
  )
}

const MemoizedStakeForm = memo(StakeForm)
export { MemoizedStakeForm as StakeForm }
