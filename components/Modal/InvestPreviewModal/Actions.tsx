import { memo } from 'react'
import { useRecoilValue } from 'recoil'
import type { StateValue } from 'xstate'
import styles from './Actions.module.scss'

import { poolTokenApprovalsState } from 'app/states/approval'
import { useInvestMachine } from './useInvestMachine'

import { Button } from 'components/Button'
import { InvestActionStep } from './ActionStep'

type InvestActionsProps = {
  amounts: string[]
  currentEthType: EthType
}

function InvestActions({ amounts, currentEthType }: InvestActionsProps) {
  const { handleSubmit, state, stepsToSkip } = useInvestMachine(
    amounts,
    currentEthType
  )

  const poolTokenApprovals = useRecoilValue(poolTokenApprovalsState)

  const submitDisabled = [
    'approvingWncg',
    'approvingWeth',
    'investing',
  ].includes(state.value as string)

  return (
    <footer>
      <div className={styles.stepsWrapper}>
        <div className={styles.divider} aria-hidden />

        <ol className={styles.steps}>
          <InvestActionStep
            action="approveWncg"
            completed={poolTokenApprovals[0]}
            currentState={state.value}
            label={1}
            pending="approvingWncg"
            skip={stepsToSkip[0]}
            approvalStep
            token="wncg"
          />
          <InvestActionStep
            action="approveWeth"
            completed={poolTokenApprovals[1]}
            currentState={state.value}
            label={2}
            pending="approvingWeth"
            skip={stepsToSkip[1]}
            approvalStep
            token="weth"
          />
          <InvestActionStep
            action="invest"
            completed="completed"
            currentState={state.value}
            label={3}
            pending="investing"
          />
        </ol>
      </div>
      <Button
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

export default memo(InvestActions)

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
    case 'invest':
      return 'Invest'
    case 'investing':
      return 'Investing'
    default:
      return 'Invest'
  }
}
