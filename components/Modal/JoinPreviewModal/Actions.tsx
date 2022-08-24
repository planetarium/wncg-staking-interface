import { memo, MouseEvent } from 'react'
import { useRecoilValue } from 'recoil'
import type { StateValue } from 'xstate'
import styles from './Actions.module.scss'

import { poolTokenApprovalsState } from 'app/states/approval'
import { ModalCategory } from 'app/states/modal'
import { useJoinMachine } from './useJoinMachine'
import { useModal } from 'hooks'

import { Button } from 'components/Button'
import { Icon } from 'components/Icon'
import { JoinActionStep } from './ActionStep'

type JoinActionsProps = {
  amounts: string[]
  disabled: boolean
  isNativeAsset: boolean
}

function JoinActions({ amounts, disabled, isNativeAsset }: JoinActionsProps) {
  const { handleJoin, state, stepsToSkip } = useJoinMachine(
    amounts,
    isNativeAsset
  )
  const { removeModal } = useModal()

  const poolTokenApprovals = useRecoilValue(poolTokenApprovalsState)

  const submitDisabled = ['approvingWncg', 'approvingWeth', 'joining'].includes(
    state.value as string
  )
  const isCompleted = state.value === 'completed'
  const isCloseButton = isCompleted || disabled

  function closeModal() {
    removeModal(ModalCategory.JoinPreview)
  }

  function handleSubmit(e: MouseEvent) {
    e.stopPropagation()

    if (disabled) {
      closeModal()
      return
    }

    handleJoin()
  }

  return (
    <footer>
      <div className={styles.stepsWrapper}>
        <div className={styles.divider} aria-hidden />

        <ol className={styles.steps}>
          <JoinActionStep
            action="approveWncg"
            completed={poolTokenApprovals[0]}
            currentState={state.value}
            label={1}
            pending="approvingWncg"
            skip={stepsToSkip[0]}
            approvalStep
            token="wncg"
          />
          <JoinActionStep
            action="approveWeth"
            completed={poolTokenApprovals[1]}
            currentState={state.value}
            label={2}
            pending="approvingWeth"
            skip={stepsToSkip[1]}
            approvalStep
            token="weth"
          />
          <JoinActionStep
            action="join"
            completed="completed"
            currentState={state.value}
            label={3}
            pending="joining"
          />
        </ol>
      </div>

      {disabled && (
        <aside className={styles.warning}>
          <h3>
            <Icon id="info" />
            This price impact is too high.
            <br />
            You cannot proceed.
          </h3>
          <p>
            The likelyhood of you losing money is too high. For your protection,
            you can&apos;t perform this transaction on this interface.
          </p>
        </aside>
      )}

      {isCompleted && (
        <Button
          className={styles.stakeButton}
          onClick={closeModal}
          size="large"
          href="/wncg"
          fullWidth
          disabled={submitDisabled}
        >
          Stake
        </Button>
      )}

      <Button
        variant={isCloseButton ? 'secondary' : 'primary'}
        size="large"
        onClick={handleSubmit}
        fullWidth
        disabled={submitDisabled}
      >
        {disabled ? 'Close' : renderButtonLabel(state.value)}
      </Button>
    </footer>
  )
}

export default memo(JoinActions)

function renderButtonLabel(state: StateValue) {
  switch (state) {
    case 'approveWncg':
      return 'Approve WNCG'
    case 'approvingWncg':
      return 'Approving WNCG'
    case 'approveWeth':
      return 'Approve WETH'
    case 'approvingWeth':
      return 'Approving WETH'
    case 'join':
      return 'Join pool'
    case 'joining':
      return 'Joining pool'
    case 'completed':
      return 'Close'
    default:
      return 'Join'
  }
}
