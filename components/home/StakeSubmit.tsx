import { useCallback, useEffect, useState } from 'react'
import { usePrevious } from 'react-use'
import Lottie from 'lottie-react'
import { Event } from 'ethers'
import clsx from 'clsx'
import styles from './styles/StakeSubmit.module.scss'

import { getAccount, getIsConnected } from 'app/states/connection'
import { ModalCategory } from 'app/states/modal'
import { configService } from 'services/config'
import { TransactionAction } from 'services/transaction'
import { gaEvent } from 'lib/gtag'
import { handleError } from 'utils/error'
import { createApprovalEventFilter } from 'utils/event'
import {
  useAllowances,
  useApprove,
  useAppSelector,
  useConnection,
  useEventFilters,
  useModal,
  usePool,
  useProvider,
  useStake,
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
  const { stakedEventFilter } = useEventFilters()
  const { addModal } = useModal()
  const { bptAddress, poolTokenName } = usePool()
  const provider = useProvider()
  const { stake } = useStake()
  const { unstakeStatus } = useUnstakeTimestamps()

  const account = useAppSelector(getAccount)
  const isConnected = useAppSelector(getIsConnected)
  const isUnstakeWindow = UNSTAKE_WINDOW.includes(unstakeStatus)

  const isApproved = allowanceFor(bptAddress, configService.stakingAddress)
  const isLoading = active !== null

  function resetStatus() {
    setActive(null)
    setPendingTx('')
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
      if (hash) {
        setPendingTx(hash)
      }
      clearInput()
    } catch (error) {
      handleError(error, TransactionAction.Stake)
      setActive(null)
    }
  }

  async function handleApprove() {
    setActive('approval')
    gaEvent({
      name: 'approve_to_stake',
    })

    try {
      await approve(bptAddress, configService.stakingAddress)
    } catch (error) {
      handleError(error, TransactionAction.Approve)
      setActive(null)
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
    if (!isApproved) {
      handleApprove()
    } else {
      handleStake()
    }
  }

  const approvalEventFilter = createApprovalEventFilter(
    account,
    bptAddress,
    configService.stakingAddress
  )

  const handleApprovalEvent = useCallback(() => {
    setActive(null)
  }, [])

  const handleStakedEvent = useCallback(
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
    if (approvalEventFilter) {
      provider?.on(approvalEventFilter, handleApprovalEvent)
      return () => {
        provider?.off(approvalEventFilter)
      }
    }
  }, [approvalEventFilter, handleApprovalEvent, isApproved, provider])

  // NOTE: Staked event
  useEffect(() => {
    if (stakedEventFilter) {
      provider?.on(stakedEventFilter, handleStakedEvent)
      return () => {
        provider?.off(stakedEventFilter)
      }
    }
  }, [handleStakedEvent, provider, stakedEventFilter])

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
