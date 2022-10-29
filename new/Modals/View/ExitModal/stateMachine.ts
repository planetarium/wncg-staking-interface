import { assign } from '@xstate/fsm'
import { createMachine } from 'xstate'
import type { StateValue } from 'xstate'

import { assertUnreachable } from 'utils/assertion'

export type ExitMachineContext = {
  hash?: string
}

export const exitMachine = createMachine<ExitMachineContext>(
  {
    id: `exitMachine`,
    initial: `idle`,
    context: {
      hash: undefined,
    },
    states: {
      idle: {
        always: [
          { target: `exitPending`, cond: `waitForExit` },
          { target: `form`, cond: `shouldFillForm` },
        ],
      },
      form: {
        on: {
          NEXT: {
            target: `exit`,
          },
        },
      },
      exit: {
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
    case 'idle':
      return 0
    case 'form':
      return 1
    case 'exit':
    case 'exitPending':
      return 2
    case 'exitSuccess':
    case 'exitFail':
      return 3
    default:
      assertUnreachable(value)
  }
}
