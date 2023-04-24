import { assign, createMachine, StateValue } from 'xstate'

import { assertUnreachable } from 'utils/assertUnreachable'

type JoinMachineContext = {
  hash?: string
}

export const joinMachine = createMachine<JoinMachineContext>(
  {
    predictableActionArguments: true,
    id: `joinMachine`,
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
          SUCCESS: {
            target: 'success',
          },
          NEXT: {
            target: 'pending',
          },
          FAIL: {
            target: 'fail',
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
      resetHash: assign<JoinMachineContext>({
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
