import { FormEvent, useCallback, useEffect } from 'react'
import type {
  Control as ReactHookFormControl,
  FieldValues,
} from 'react-hook-form'
import dynamic from 'next/dynamic'
import { useDebounce } from 'use-debounce'
import { AnimatePresence, motion } from 'framer-motion'

import { ModalType } from 'config/constants'
import { ANIMATION_MAP, EXIT_MOTION, MOTION } from 'config/constants/motions'
import { bnum } from 'utils/bnum'
import { useAllowances, useAuth, useChain, useModal, useStaking } from 'hooks'
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
  const { stakingAddress } = useChain()
  const { addModal } = useModal()
  const { lpToken } = useStaking()

  const {
    closePopup,
    control,
    maxBalance,
    maxBalanceInFiatValue,
    resetForm,
    rules,
    setMaxValue,
    showPopup,
    stakeAmount,
    submitDisabled,
    togglePopup,
  } = useStakeForm()

  const [debouncedStakeAmount] = useDebounce(stakeAmount, 500)

  const isApproved = bnum(allowanceFor(lpToken.address, stakingAddress)).gte(
    stakeAmount
  )

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
            spender: stakingAddress,
            spenderName: 'staking',
            tokenAddress: lpToken.address,
            tokenName: lpToken.name,
            tokenSymbol: `LP token(${lpToken.name})`,
            tokenDecimals: lpToken.decimals,
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
      isApproved,
      lpToken.address,
      lpToken.decimals,
      lpToken.name,
      resetForm,
      stakeAmount,
      stakingAddress,
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
            address={lpToken.address}
            rules={rules}
            decimals={lpToken.decimals}
            maxAmount={maxBalance}
            setMaxValue={setMaxValue}
            showFiatValue
            onMaxButtonBlur={closePopup}
            onClick={togglePopup}
            placeholder="Amount of LP tokens to stake"
          />

          <AvailableBalance
            label="LP tokens in my wallet (available to stake)"
            maxAmount={maxBalance}
            fiatValue={maxBalanceInFiatValue}
          />
        </div>

        <SubmitButton disabled={submitDisabled} />
      </div>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            {...EXIT_MOTION}
            variants={ANIMATION_MAP.slideInDown}
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
