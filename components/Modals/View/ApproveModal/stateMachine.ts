import { assign, createMachine, StateValue } from 'xstate'

import { assertUnreachable } from 'utils/assertUnreachable'

type ApproveMachineContext = {
  hash?: string
}

export const approveMachine = createMachine<ApproveMachineContext>(
  {
    predictableActionArguments: true,
    id: `approveMachine`,
    initial: 'preview',
    context: {
      hash: undefined,
    },
    states: {
      preview: {
        always: [
          {
            target: 'pending',
            cond: 'txPending',
          },
        ],
        on: {
          NEXT: {
            target: 'pending',
          },
          FAIL: {
            target: 'fail',
            actions: [`resetHash`],
          },
          SUCCESS: {
            target: 'success',
            actions: [`resetHash`],
          },
        },
      },
      pending: {
        on: {
          FAIL: {
            target: 'fail',
            actions: [`resetHash`],
          },
          ROLLBACK: {
            target: 'preview',
            actions: [`resetHash`],
          },
          SUCCESS: {
            target: 'success',
            actions: [`resetHash`],
          },
        },
      },
      success: {
        on: {
          ROLLBACK: {
            target: 'preview',
            actions: [`resetHash`],
          },
        },
      },
      fail: {
        type: 'final',
      },
    },
  },
  {
    actions: {
      resetHash: assign<ApproveMachineContext>({
        hash: undefined,
      }),
    },
    guards: {
      txPending(ctx) {
        return !!ctx.hash
      },
    },
  }
)

export function pageFor(value: StateValue) {
  switch (value) {
    case 'preview':
    case 'pending':
      return 1
    case 'success':
      return 2
    case 'fail':
      return 3
    default:
      assertUnreachable(value)
  }
}
