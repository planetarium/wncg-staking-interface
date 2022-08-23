import { memo } from 'react'
import { useRecoilValue } from 'recoil'
import type { StateValue } from 'xstate'
import styles from './Actions.module.scss'

import { poolTokenApprovalsState } from 'app/states/approval'
import { ModalCategory } from 'app/states/modal'
import { useJoinMachine } from './useJoinMachine'
import { useModal } from 'hooks'

import { Button } from 'components/Button'
import { JoinActionStep } from './ActionStep'

type JoinActionsProps = {
  amounts: string[]
  isNativeAsset: boolean
}

function JoinActions({ amounts, isNativeAsset }: JoinActionsProps) {
  const { handleSubmit, state, stepsToSkip } = useJoinMachine(
    amounts,
    isNativeAsset
  )
  const { removeModal } = useModal()

  const poolTokenApprovals = useRecoilValue(poolTokenApprovalsState)

  const submitDisabled = ['approvingWncg', 'approvingWeth', 'joining'].includes(
    state.value as string
  )
  const isCompleted = state.value === 'completed'

  function closeModal() {
    removeModal(ModalCategory.JoinPreview)
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
        variant={isCompleted ? 'secondary' : 'primary'}
        size="large"
        onClick={handleSubmit}
        fullWidth
        disabled={submitDisabled}
      >
        {renderButtonLabel(state.value)}
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
      return 'Join Pool'
  }
}
