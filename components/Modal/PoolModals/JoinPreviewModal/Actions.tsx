import { memo, MouseEvent } from 'react'
import { useMount, useUnmount } from 'react-use'
import styles from './Actions.module.scss'

import { ModalCategory } from 'app/states/modal'
import { useModal, usePool, useProvider } from 'hooks'
import { getJoinActionButtonLabel, isApprovingState } from './utils'
import { useJoinEvents } from './useJoinEvents'
import { useJoinMachine } from './useJoinMachine'

import { Button } from 'components/Button'
import { PreviewWarning } from '../Warning'
import { JoinActionStep } from './ActionStep'

type JoinActionsProps = {
  amounts: string[]
  isNativeAsset: boolean
  rektPriceImpact: boolean
}

function JoinActions({
  amounts,
  isNativeAsset,
  rektPriceImpact,
}: JoinActionsProps) {
  const { error, handleJoin, send, state, stepsToSkip } = useJoinMachine(
    amounts,
    isNativeAsset
  )
  const { eventFilters, eventHandlers } = useJoinEvents(send)
  const { removeModal } = useModal()
  const { poolTokenAddresses, poolTokenSymbols } = usePool()
  const provider = useProvider()

  const submitDisabled =
    isApprovingState(state.value) || state.value === 'joining'
  const isCompleted = state.value === 'completed'
  const isIdle = state.value === 'idle'
  const showCloseButton = isCompleted || isIdle || rektPriceImpact

  function closeModal() {
    removeModal(ModalCategory.JoinPreview)
  }

  function handleSubmit(e: MouseEvent) {
    e.stopPropagation()

    if (showCloseButton) {
      closeModal()
      return
    }

    handleJoin()
  }

  useMount(() => {
    eventFilters.forEach((filter, i) => {
      const handler = eventHandlers[i]
      if (!filter || !handler) return
      provider?.on(filter, handler)
    })
  })

  useUnmount(() => {
    eventFilters.forEach((filter) => {
      if (!filter) return
      provider?.off(filter)
    })
  })

  return (
    <footer>
      <div className={styles.stepsWrapper}>
        <div className={styles.divider} aria-hidden />

        <ol className={styles.steps}>
          {poolTokenSymbols.map((symbol, i) => {
            return (
              <JoinActionStep
                key={`joinActionStep.${symbol}`}
                action={`approve${symbol}`}
                completed={state.context.approvals[i]}
                currentState={state.value}
                label={i + 1}
                pending={`approving${symbol}`}
                skip={stepsToSkip[i]}
                approvalStep
                token={symbol}
              />
            )
          })}

          <JoinActionStep
            action="join"
            completed="completed"
            currentState={state.value}
            label={poolTokenAddresses.length + 1}
            pending="joining"
          />
        </ol>
      </div>

      <PreviewWarning rektPriceImpact={rektPriceImpact} error={error} />

      {isCompleted && (
        <Button
          className={styles.stakeButton}
          onClick={closeModal}
          size="large"
          href="/wncg"
          fullWidth
        >
          Stake
        </Button>
      )}

      <Button
        variant={showCloseButton ? 'secondary' : 'primary'}
        size="large"
        onClick={handleSubmit}
        fullWidth
        loading={submitDisabled}
        disabled={submitDisabled}
      >
        {showCloseButton ? 'Close' : getJoinActionButtonLabel(state.value)}
      </Button>
    </footer>
  )
}

export default memo(JoinActions)
