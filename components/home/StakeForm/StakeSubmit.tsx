import { useCallback, useEffect, useState } from 'react'
import { usePrevious } from 'react-use'
import { useAtomValue } from 'jotai'
import clsx from 'clsx'
import styles from '../styles/StakeSubmit.module.scss'

import { stakingContractAddressAtom } from 'states/staking'
import { ModalCategory } from 'states/ui'
import { legacyModeAtom } from 'states/userSettings'
import { gaEvent } from 'lib/gtag'
import { parseTxError } from 'utils/tx'
import {
  useAccount,
  useAllowances,
  useApprove,
  useConnectWallets,
  useModal,
  usePool,
  useProvider,
  useStake,
  useToast,
  useUnstakeTimestamps,
} from 'hooks'
import { UnstakeStatus } from 'hooks/useUnstakeTimestamps'
import { approvalTooltips, renderButtonLabel, stakeTooltips } from './utils'

import { ActionStep } from 'components/ActionStep'
import { Button } from 'components/Button'
import { Icon } from 'components/Icon'

type StakeSubmitState = 'approval' | 'stake' | null

type StakeSubmitProps = {
  amount: string
  clearInput(): void
  disabled: boolean
}

const UNSTAKE_WINDOW: UnstakeStatus[] = [
  UnstakeStatus.CooldownInProgress,
  UnstakeStatus.Withdrawable,
]

export function StakeSubmit({
  amount,
  clearInput,
  disabled,
}: StakeSubmitProps) {
  const [currentState, setCurrentState] = useState<StakeSubmitState>(null)
  const [isStaked, setIsStaked] = useState(false)
  const [pendingTx, setPendingTx] = useState('')
  const prevAmount = usePrevious(amount)

  const { isConnected } = useAccount()
  const { allowanceFor } = useAllowances()
  const { connect } = useConnectWallets()
  const { addModal } = useModal()
  const { bptAddress } = usePool()
  const provider = useProvider()
  const { stake } = useStake()
  const { addToast } = useToast()
  const { unstakeStatus } = useUnstakeTimestamps()

  const legacyMode = useAtomValue(legacyModeAtom)
  const stakingAddress = useAtomValue(stakingContractAddressAtom)
  const isUnstakeWindow = UNSTAKE_WINDOW.includes(unstakeStatus)

  const { approve } = useApprove(bptAddress, stakingAddress)

  const isApproved = allowanceFor(bptAddress, stakingAddress)
  const isLoading = currentState !== null

  function resetStatus() {
    setCurrentState(null)
    setPendingTx('')
  }

  const handleError = useCallback(
    (error: any) => {
      const errorMsg = parseTxError(error)
      if (errorMsg) {
        addToast({
          ...errorMsg,
          type: 'error',
        })
      }
      resetStatus()
    },
    [addToast]
  )

  async function initStake() {
    setCurrentState('stake')
    gaEvent({
      name: 'stake',
      params: {
        amount,
      },
    })

    try {
      const hash = await stake(amount)
      if (hash) setPendingTx(hash)
      clearInput()
    } catch (error) {
      handleError(error)
    }
  }

  async function handleApprove() {
    setCurrentState('approval')
    gaEvent({
      name: 'approve_to_stake',
    })

    try {
      const hash = await approve()
      // if (hash) setPendingTx(hash)
    } catch (error) {
      handleError(error)
    }
  }

  function handleStake() {
    if (isUnstakeWindow) {
      addModal({
        category: ModalCategory.StakeWarning,
        props: {
          stake: initStake,
        },
      })
      return
    }
    initStake()
  }

  function handleSubmit() {
    if (disabled) return
    if (!isApproved) handleApprove()
    else handleStake()
  }

  const pingPendingTx = useCallback(async () => {
    if (!provider || !pendingTx) return

    try {
      const tx = await provider.getTransaction(pendingTx)
      await tx.wait()
      resetStatus()
      if (currentState === 'stake') setIsStaked(true)
      setCurrentState(null)
    } catch (error) {
      handleError(error)
    }
  }, [currentState, handleError, pendingTx, provider])

  useEffect(() => {
    pingPendingTx()
  }, [pendingTx, pingPendingTx])

  useEffect(() => {
    if (amount && prevAmount !== amount) {
      resetStatus()
      setIsStaked(false)
    }
  }, [amount, prevAmount])

  if (!isConnected) {
    return (
      <Button size="large" onClick={connect} fullWidth>
        Connect
      </Button>
    )
  }

  return (
    <>
      <div className={styles.stepsWrapper}>
        <div
          className={clsx(styles.divider, {
            [styles.lastStep]: isApproved,
            [styles.isStaked]: isStaked,
          })}
          aria-hidden
        />

        <ol className={styles.steps}>
          <ActionStep<StakeSubmitState>
            action="approval"
            completed={isApproved}
            currentState={currentState}
            label={1}
            pending="approval"
            isDark
            tooltip={approvalTooltips}
            approvalStep
            smallTooltip
          />
          <ActionStep<StakeSubmitState>
            action="stake"
            completed={isStaked}
            currentState={currentState}
            label={2}
            pending="stake"
            isDark
            tooltip={stakeTooltips}
            smallTooltip
          />
        </ol>
      </div>

      <Button
        size="large"
        onClick={handleSubmit}
        disabled={disabled || isLoading}
        loading={isLoading}
        fullWidth
      >
        {renderButtonLabel(isApproved, isLoading)}
      </Button>

      {isApproved && !legacyMode && (
        <dl className={styles.cooldown}>
          <dt>
            Cooldown period
            <div className={styles.info}>
              <Icon id="info" />
              <p className={styles.tooltip}>
                You can withdraw your staked tokens after the cooldown period
                ends and the withdrawal window is active.
              </p>
            </div>
          </dt>
          <dd aria-label="14 days">14d</dd>
        </dl>
      )}
    </>
  )
}
