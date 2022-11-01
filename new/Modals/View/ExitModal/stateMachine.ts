import { assign } from '@xstate/fsm'
import { createMachine } from 'xstate'
import type { StateValue } from 'xstate'

import { assertUnreachable } from 'utils/assertion'

export type ExitMachineContext = {
  hash?: string
}

export const exitMachine = createMachine<ExitMachineContext>(
  {
    predictableActionArguments: true,
    id: `exitMachine`,
    initial: `exit`,
    context: {
      hash: undefined,
    },
    states: {
      exit: {
        always: [{ target: `exitPending`, cond: `waitForExit` }],
        on: {
          CALL: {
            target: `exitPending`,
          },
          FAIL: {
            target: 'exitFail',
            actions: [`resetHash`],
          },
        },
      },
      exitPending: {
        on: {
          ROLLBACK: {
            target: 'exit',
            actions: [`resetHash`],
          },
          SUCCESS: {
            target: 'exitSuccess',
            actions: [`resetHash`],
          },
          FAIL: {
            target: 'exitFail',
            actions: [`resetHash`],
          },
        },
      },
      exitSuccess: {
        type: 'final',
      },
      exitFail: {
        type: 'final',
      },
    },
  },
  {
    actions: {
      resetHash: assign<ExitMachineContext>({
        hash: undefined,
      }),
    },
    guards: {
      shouldFillForm(ctx) {
        return !ctx.hash
      },
      waitForExit(ctx) {
        return !!ctx.hash
      },
    },
  }
)

export function currentPage(value: StateValue) {
  switch (value) {
    case 'exit':
    case 'exitPending':
      return 1
    case 'exitSuccess':
    case 'exitFail':
      return 2
    default:
      assertUnreachable(value)
  }
}
