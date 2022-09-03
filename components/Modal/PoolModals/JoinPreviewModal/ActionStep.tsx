import type { StateValue } from 'xstate'
import Lottie from 'lottie-react'
import clsx from 'clsx'
import styles from './Actions.module.scss'

import loadingAnimation from 'animations/spinner-black.json'

import { Icon } from 'components/Icon'

type JoinActionStepProps = {
  action: StateValue
  completed: StateValue | boolean
  currentState: StateValue | boolean
  label: number
  pending: StateValue
  approvalStep?: boolean
  skip?: boolean
  token?: string
}

export function JoinActionStep({
  action,
  completed,
  currentState,
  pending,
  label,
  approvalStep = false,
  skip = false,
  token = '',
}: JoinActionStepProps) {
  const isActive = currentState === action
  const isPending = currentState === pending
  const isCompleted =
    typeof completed === 'boolean' ? completed : currentState === completed
  const isDone = isCompleted || skip

  const tooltip = renderTooltipText(token, approvalStep, completed, skip)
  const isTooltipSmall = approvalStep && !!completed

  return (
    <li
      className={clsx(styles.step, {
        [styles.active]: isActive,
        [styles.pending]: isPending,
        [styles.done]: isDone,
      })}
    >
      {isDone ? <Icon id="check" /> : label}
      {isPending && (
        <Lottie
          className={styles.lottie}
          animationData={loadingAnimation}
          loop
        />
      )}

      <strong
        className={clsx(styles.tooltip, { [styles.small]: isTooltipSmall })}
      >
        {tooltip}
      </strong>
    </li>
  )
}

function renderTooltipText(
  token: string,
  approvalStep: boolean,
  completed: StateValue | boolean,
  skip: boolean
) {
  const tokenFullName = token.toUpperCase()

  switch (true) {
    case !approvalStep:
      return 'Confirm investment into this pool'
    case !!completed:
      return `Approved ${tokenFullName}`
    case skip:
      return `You don't need to approve ${tokenFullName} because you are not investing this token on Balancer.`
    default:
      return `You must approve ${tokenFullName} to invest this token on Balancer. Approvals are required once per token, per wallet.`
  }
}
