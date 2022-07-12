import { useCallback, useEffect, useState } from 'react'
import { usePrevious } from 'react-use'
import Lottie from 'lottie-react'
import { Event } from 'ethers'
import clsx from 'clsx'
import styles from './styles/StakeSubmit.module.scss'

import { getIsApproved } from 'app/states/bpt'
import { getIsConnected } from 'app/states/connection'
import { ModalCategory } from 'app/states/modal'
import { TransactionAction } from 'app/states/transaction'
import { getIsUnstakeWindow } from 'app/states/unstake'
import { gaEvent } from 'lib/gtag'
import {
  useAppSelector,
  useBpt,
  useConnection,
  useError,
  useEventFilter,
  useModal,
  useProvider,
  useStake,
} from 'hooks'

import loadingAnimation from 'animations/spinner.json'

import { Button } from 'components/Button'
import { Icon } from 'components/Icon'

type StakeSubmitProps = {
  amount: string
  clearInput(): void
  disabled: boolean
}

export function StakeSubmit({
  amount,
  clearInput,
  disabled,
}: StakeSubmitProps) {
  const [active, setActive] = useState<'approval' | 'stake' | null>(null)
  const [isStaked, setIsStaked] = useState(false)
  const [pendingTx, setPendingTx] = useState('')
  const prevAmount = usePrevious(amount)

  const { approve } = useBpt()
  const { connect } = useConnection()
  const { handleError } = useError()
  const { approvalEventFilter, stakedEventFilter } = useEventFilter()
  const { addModal } = useModal()
  const provider = useProvider()
  const { stake } = useStake()

  const isApproved = useAppSelector(getIsApproved)
  const isConnected = useAppSelector(getIsConnected)
  const isUnstakeWindow = useAppSelector(getIsUnstakeWindow)

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
      await approve()
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
  }, [approvalEventFilter, handleApprovalEvent, provider])

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
            <strong className={styles.tooltip}>Stake 20WETH-80WNCG</strong>
          </li>
        </ol>
      </div>

      <Button size="large" onClick={handleClick} disabled={disabled} fullWidth>
        {isApproved ? 'Stake' : 'Approve to stake'}
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
