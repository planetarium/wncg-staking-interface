import { createMachine } from 'xstate'
import type { StateValue } from 'xstate'
import { assertUnreachable } from 'utils/assertion'

type StakeMachineContext = {
  hash?: string
  isApproved: boolean
}

export const stakeMachine = createMachine<StakeMachineContext>(
  {
    predictableActionArguments: true,
    id: `stakeMachine`,
    initial: 'idle',
    context: {
      hash: undefined,
      isApproved: false,
    },
    states: {
      idle: {
        always: [
          { target: 'approve', cond: 'hasNotApproved' },
          { target: 'stake', cond: 'hasApproved' },
          { target: 'approvePending', cond: 'waitForApproval' },
          { target: 'stakePending', cond: 'waitForStake' },
        ],
      },
      approve: {
        on: {
          CALL: {
            target: 'approvePending',
          },
          FAIL: {
            target: 'approveFail',
          },
        },
      },
      approvePending: {
        on: {
          SUCCESS: {
            target: 'approveSuccess',
          },
          FAIL: {
            target: 'approveFail',
          },
        },
      },
      approveSuccess: {
        on: {
          STAKE: {
            target: 'stake',
          },
        },
      },
      approveFail: {
        type: 'final',
      },
      stake: {
        on: {
          CALL: {
            target: 'stakePending',
          },
          FAIL: {
            target: 'stakeFail',
          },
        },
      },
      stakePending: {
        on: {
          SUCCESS: {
            target: 'stakeSuccess',
          },
          FAIL: {
            target: 'stakeFail',
          },
        },
      },
      stakeSuccess: {
        type: 'final',
      },
      stakeFail: {
        type: 'final',
      },
    },
  },
  {
    guards: {
      hasNotApproved(ctx) {
        return !ctx.hash && !ctx.isApproved
      },
      hasApproved(ctx) {
        return !ctx.hash && !!ctx.isApproved
      },
      waitForApproval(ctx) {
        return !!ctx.hash && !ctx.isApproved
      },
      waitForStake(ctx) {
        return !!ctx.hash && !!ctx.isApproved
      },
    },
  }
)

export function currentPage(value: StateValue) {
  switch (value) {
    case 'idle':
      return 0
    case 'approve':
    case 'approvePending':
      return 1
    case 'approveSuccess':
    case 'approveFail':
      return 2
    case 'stake':
    case 'stakePending':
      return 3
    case 'stakeSuccess':
    case 'stakeFail':
      return 4
    default:
      console.log(value)

      assertUnreachable(value)
  }
}
