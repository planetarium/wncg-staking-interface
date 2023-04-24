import { FormEvent, useCallback, useEffect } from 'react'
import type {
  Control as ReactHookFormControl,
  FieldValues,
} from 'react-hook-form'
import dynamic from 'next/dynamic'
import { useDebounce } from 'use-debounce'
import { AnimatePresence, motion } from 'framer-motion'

import config from 'config'
import { ModalType } from 'config/constants'
import { EXIT_MOTION, MOTION } from 'config/motions'
import { slideInDown } from 'config/motionVariants'
import { bnum } from 'utils/bnum'
import { useAllowances, useAuth, useModal, useStaking } from 'hooks'
import { useStakeForm } from './useStakeForm'

import { StyledStakeForm } from './styled'
import { AvailableBalance, Control } from 'components/Form'
import Suspense from 'components/Suspense'
import SubmitButton from './SubmitButton'

const RevenuePopup = dynamic(() => import('./RevenuePopup'), {
  ssr: false,
})

export default function StakeForm() {
  const { account, prevAccount } = useAuth()
  const allowanceFor = useAllowances()
  const { addModal } = useModal()
  const { stakedTokenAddress, bptName, bptDecimals } = useStaking()

  const {
    closePopup,
    control,
    inputDisabled,
    maxBalance,
    maxBalanceInFiatValue,
    placeholder,
    resetForm,
    rules,
    setMaxValue,
    showPopup,
    stakeAmount,
    submitDisabled,
    togglePopup,
  } = useStakeForm()

  const [debouncedStakeAmount] = useDebounce(stakeAmount, 500)

  const hasBalance = bnum(maxBalance).gt(0)
  const isApproved = bnum(
    allowanceFor(stakedTokenAddress, config.stakingAddress)
  ).gte(stakeAmount)

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()

      const stakeConfig = {
        stakeAmount,
        resetForm,
      }

      const modalType = isApproved ? ModalType.Stake : ModalType.Approve
      const props = isApproved
        ? stakeConfig
        : {
            spender: config.stakingAddress,
            spenderName: 'staking',
            tokenAddress: stakedTokenAddress,
            tokenName: bptName,
            tokenSymbol: bptName,
            tokenDecimals: bptDecimals,
            approvePurpose: '',
            buttonLabel: 'Go to stake',
            toastLabel: 'stake',
            nextAction: {
              type: ModalType.Stake,
              props: stakeConfig,
            },
          }

      addModal({
        type: modalType,
        props,
      })
    },
    [
      addModal,
      bptDecimals,
      bptName,
      isApproved,
      resetForm,
      stakeAmount,
      stakedTokenAddress,
    ]
  )

  useEffect(() => {
    if (account !== prevAccount) {
      resetForm()
    }
  }, [account, prevAccount, resetForm])

  return (
    <StyledStakeForm {...MOTION} onSubmit={handleSubmit}>
      <div className="field">
        <div className="inputGroup">
          <Control<'number'>
            id="stakeAmount"
            control={
              control as unknown as ReactHookFormControl<FieldValues, 'any'>
            }
            name="stakeAmount"
            address={stakedTokenAddress}
            rules={rules}
            decimals={bptDecimals}
            maxAmount={maxBalance}
            setMaxValue={setMaxValue}
            disabled={inputDisabled}
            showFiatValue
            onMaxButtonBlur={closePopup}
            onClick={togglePopup}
            placeholder={placeholder}
          />

          {hasBalance && (
            <AvailableBalance
              label="LP tokens in my wallet (available to stake)"
              maxAmount={maxBalance}
              fiatValue={maxBalanceInFiatValue}
            />
          )}
        </div>

        <SubmitButton disabled={submitDisabled} />
      </div>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            {...EXIT_MOTION}
            variants={slideInDown}
            transition={{ duration: 0.2 }}
          >
            <Suspense>
              <RevenuePopup className="popup" amount={debouncedStakeAmount} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </StyledStakeForm>
  )
}
