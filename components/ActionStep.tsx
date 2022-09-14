import Lottie from 'lottie-react'
import clsx from 'clsx'
import styles from './styles/ActionStep.module.scss'

import loadingAnimation from 'animations/spinner.json'
import loadingBlackAnimation from 'animations/spinner-black.json'

import { Icon } from 'components/Icon'

type ActionStepProps<T> = {
  action: T
  completed: T | boolean
  currentState: T | boolean
  label: number
  pending: T
  tooltip: string[]
  approvalStep?: boolean
  isDark?: boolean
  smallTooltip?: boolean
  skip?: boolean
}

export function ActionStep<T>({
  action,
  completed,
  currentState,
  label,
  pending,
  approvalStep = false,
  isDark,
  smallTooltip,
  tooltip,
  skip = false,
}: ActionStepProps<T>) {
  const isActive = currentState === action
  const isPending = currentState === pending
  const isCompleted =
    typeof completed === 'boolean' ? completed : currentState === completed
  const isDone = isCompleted || skip
  const isTooltipSmall = smallTooltip || (approvalStep && !!completed)

  const currentTooltip = isDone ? tooltip[1] : tooltip[0]
  const animation = isDark ? loadingAnimation : loadingBlackAnimation

  return (
    <li
      className={clsx(styles.step, {
        [styles.active]: isActive,
        [styles.pending]: isPending,
        [styles.done]: isDone,
        [styles.dark]: isDark,
      })}
    >
      {isDone ? <Icon id="check" /> : label}

      {isPending && (
        <Lottie className={styles.lottie} animationData={animation} loop />
      )}

      <strong
        className={clsx(styles.tooltip, { [styles.small]: isTooltipSmall })}
      >
        {currentTooltip}
      </strong>
    </li>
  )
}
