import { memo, useMemo } from 'react'
import { Control, FieldValues, useForm } from 'react-hook-form'
import { useRecoilValue } from 'recoil'
import { useNetwork } from 'wagmi'
import { AnimatePresence, motion } from 'framer-motion'
import styles from '../styles/Forms.module.scss'

import { legacyModeState } from 'app/states/settings'
import { gaEvent } from 'lib/gtag'
import { networkChainId } from 'utils/network'
import { bnum } from 'utils/num'
import { useBalances, usePool } from 'hooks'
import { formTransition, motionVariants, TabId, TabPanelId } from '../constants'

import { EstimatedEarn } from './EstimatedEarn'
import { InputGroup } from '../InputGroup'
import { StakeSubmit } from './StakeSubmit'
import { StakeFormBlock } from './Block'

const minAmount = 1e-18

function StakeForm() {
  const { bptBalance } = useBalances()
  const { chain } = useNetwork()
  const { poolTokenName } = usePool()

  const legacyMode = useRecoilValue(legacyModeState)
  const networkMismatch = chain && chain.id !== networkChainId

  const { clearErrors, control, formState, setValue, watch } = useForm<{
    stakeAmount: string
  }>({
    mode: 'onBlur',
  })
  const stakeAmountValue = watch('stakeAmount')
  const disabled =
    legacyMode ||
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
      className={styles.form}
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
        disabled={legacyMode}
        setMaxValue={setMaxValue}
      />
      <EstimatedEarn amount={stakeAmountValue} />
      <StakeSubmit
        amount={stakeAmountValue}
        clearInput={clearInput}
        disabled={disabled}
      />

      <AnimatePresence>{legacyMode && <StakeFormBlock />}</AnimatePresence>
    </motion.section>
  )
}

const MemoizedStakeForm = memo(StakeForm)
export { MemoizedStakeForm as StakeForm }
