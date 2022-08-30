import { memo, MouseEvent } from 'react'
import { useMount, useUnmount } from 'react-use'
import styles from './Actions.module.scss'

import { ModalCategory } from 'app/states/modal'
import { useModal, usePool, useProvider } from 'hooks'
import { getJoinActionButtonLabel, isApprovingState } from './utils'
import { useJoinEvents } from './useJoinEvents'
import { useJoinMachine } from './useJoinMachine'

import { Button } from 'components/Button'
import { Icon } from 'components/Icon'
import { JoinActionStep } from './ActionStep'

type JoinActionsProps = {
  amounts: string[]
  disabled: boolean
  isNativeAsset: boolean
}

function JoinActions({ amounts, disabled, isNativeAsset }: JoinActionsProps) {
  const { handleJoin, send, state, stepsToSkip } = useJoinMachine(
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
  const showCloseButton = isCompleted || isIdle || disabled

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
        {disabled ? 'Close' : getJoinActionButtonLabel(state.value)}
      </Button>
    </footer>
  )
}

export default memo(JoinActions)
