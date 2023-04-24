import { assign, createMachine, StateValue } from 'xstate'

import { assertUnreachable } from 'utils/assertUnreachable'

type UnstakeMachineContext = {
  hash?: string
}

export const unstakeMachine = createMachine<UnstakeMachineContext>(
  {
    predictableActionArguments: true,
    id: `unstakeMachine`,
    initial: 'idle',
    context: {
      hash: undefined,
    },
    states: {
      idle: {
        always: [
          {
            target: 'pending',
            cond: 'txPending',
          },
        ],
        on: {
          NEXT: {
            target: 'preview',
          },
          FAIL: {
            target: 'fail',
            actions: [`resetHash`],
          },
        },
      },
      preview: {
        on: {
          NEXT: {
            target: 'pending',
          },
          ROLLBACK: {
            target: 'idle',
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
        type: 'final',
      },
      fail: {
        type: 'final',
      },
    },
  },
  {
    actions: {
      resetHash: assign<UnstakeMachineContext>({
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
    case 'idle':
      return 1
    case 'preview':
    case 'pending':
      return 2
    case 'success':
      return 3
    case 'fail':
      return 4
    default:
      assertUnreachable(value)
  }
}
