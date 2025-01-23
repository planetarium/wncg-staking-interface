import { assign, createMachine, StateValue } from 'xstate'

import { assertUnreachable } from 'utils/assertUnreachable'

type CooldownMachineContext = {
  hash?: string
}

export const cooldownMachine = createMachine<CooldownMachineContext>(
  {
    predictableActionArguments: true,
    id: `cooldownMachine`,
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
            target: 'idle',
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
      resetHash: assign<CooldownMachineContext>({
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
