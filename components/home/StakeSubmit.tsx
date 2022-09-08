import { useCallback, useEffect, useState } from 'react'
import { usePrevious } from 'react-use'
import Lottie from 'lottie-react'
import { useRecoilValue } from 'recoil'
import type { Event } from 'ethers'
import clsx from 'clsx'
import styles from './styles/StakeSubmit.module.scss'

import { connectedState } from 'app/states/connection'
import { ModalCategory } from 'app/states/modal'
import { stakingContractAddressState } from 'app/states/settings'
import { gaEvent } from 'lib/gtag'
import { parseTxError } from 'utils/error'
import {
  useAllowances,
  useApprove,
  useConnection,
  useEvents,
  useModal,
  usePool,
  useProvider,
  useStake,
  useToast,
  useUnstakeTimestamps,
} from 'hooks'
import { UnstakeStatus } from 'hooks/useUnstakeTimestamps'

import loadingAnimation from 'animations/spinner.json'

import { Button } from 'components/Button'
import { Icon } from 'components/Icon'

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
  const [active, setActive] = useState<'approval' | 'stake' | null>(null)
  const [isStaked, setIsStaked] = useState(false)
  const [pendingTx, setPendingTx] = useState('')
  const prevAmount = usePrevious(amount)

  const { allowanceFor } = useAllowances()
  const { approve } = useApprove()
  const { connect } = useConnection()
  const { createApprovalEvent, stakedEvent } = useEvents()
  const { addModal } = useModal()
  const { bptAddress, poolTokenName } = usePool()
  const provider = useProvider()
  const { stake } = useStake()
  const { addErrorToast } = useToast()
  const { unstakeStatus } = useUnstakeTimestamps()

  const isConnected = useRecoilValue(connectedState)
  const stakingAddress = useRecoilValue(stakingContractAddressState)
  const isUnstakeWindow = UNSTAKE_WINDOW.includes(unstakeStatus)

  const isApproved = allowanceFor(bptAddress, stakingAddress)
  const isLoading = active !== null

  function resetStatus() {
    setActive(null)
    setPendingTx('')
  }

  function handleError(error: any) {
    const errorMsg = parseTxError(error)
    if (errorMsg) {
      addErrorToast({
        ...errorMsg,
      })
    }
    resetStatus()
  }

  async function proceedStake() {
    setActive('stake')
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
    setActive('approval')
    gaEvent({
      name: 'approve_to_stake',
    })

    try {
      const hash = await approve(bptAddress, stakingAddress)
      if (hash) setPendingTx(hash)
    } catch (error) {
      handleError(error)
    }
  }

  function handleStake() {
    if (isUnstakeWindow) {
      addModal({
        category: ModalCategory.StakeWarning,
        props: {
          stake: proceedStake,
        },
      })
      return
    }

    proceedStake()
  }

  function handleClick() {
    if (disabled) return
    if (!isApproved) handleApprove()
    else handleStake()
  }

  const approvalFilter = createApprovalEvent(bptAddress, stakingAddress)

  const approvalHandler = useCallback(
    ({ transactionHash }: Event) => {
      if (active === 'approval' && pendingTx === transactionHash) {
        setActive(null)
      }
    },
    [active, pendingTx]
  )

  const stakedHandler = useCallback(
    async ({ transactionHash }: Event) => {
      if (pendingTx !== transactionHash) return
      if (active === 'stake') {
        setIsStaked(true)
        resetStatus()
      }
    },
    [active, pendingTx]
  )

  // NOTE: Approval event
  useEffect(() => {
    if (approvalFilter) {
      provider?.on(approvalFilter, approvalHandler)
      return () => {
        provider?.off(approvalFilter)
      }
    }
  }, [approvalFilter, approvalHandler, isApproved, provider])

  // NOTE: Staked event
  useEffect(() => {
    if (stakedEvent) {
      provider?.on(stakedEvent, stakedHandler)
      return () => {
        provider?.off(stakedEvent)
      }
    }
  }, [stakedHandler, provider, stakedEvent])

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
          <li
            className={clsx(styles.step, {
              [styles.current]: !isApproved,
              [styles.active]: active === 'approval',
              [styles.completed]: isApproved,
            })}
          >
            {isApproved ? <Icon id="check" /> : 1}
            {active === 'approval' && (
              <Lottie
                className={styles.lottie}
                animationData={loadingAnimation}
                loop
              />
            )}
            <strong className={styles.tooltip}>
              {isApproved ? 'Approved' : 'Approve to stake'}
            </strong>
          </li>

          <li
            className={clsx(styles.step, {
              [styles.current]: isApproved,
              [styles.active]: active === 'stake',
              [styles.completed]: isStaked,
            })}
          >
            {isStaked ? <Icon id="check" /> : 2}
            {active === 'stake' && (
              <Lottie
                className={styles.lottie}
                animationData={loadingAnimation}
                loop
              />
            )}
            <strong className={styles.tooltip}>Stake {poolTokenName}</strong>
          </li>
        </ol>
      </div>

      <Button
        size="large"
        onClick={handleClick}
        disabled={disabled || isLoading}
        loading={isLoading}
        fullWidth
      >
        {renderButtonLabel(isApproved, isLoading)}
      </Button>

      {isApproved && (
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

function renderButtonLabel(isApproved: boolean, isLoading: boolean) {
  switch (true) {
    case isApproved && isLoading:
      return 'Staking'
    case isApproved && !isLoading:
      return 'Stake'
    case !isApproved && isLoading:
      return 'Approving'
    case !isApproved && !isLoading:
      return 'Approve to stake'
    default:
      return ''
  }
}
