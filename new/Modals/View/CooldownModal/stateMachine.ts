import { assign, createMachine } from 'xstate'
import type { StateValue } from 'xstate'

import { assertUnreachable } from 'utils/assertion'

export type CooldownMachineContext = {
  hash?: string
}

export const cooldownMachine = createMachine<CooldownMachineContext>(
  {
    predictableActionArguments: true,
    id: `cooldownMachine`,
    initial: `idle`,
    context: {
      hash: undefined,
    },
    states: {
      idle: {
        always: [{ target: `cooldownPending`, cond: `waitForCooldown` }],
        on: {
          CALL: {
            target: `cooldown`,
          },
        },
      },
      cooldown: {
        on: {
          CALL: {
            target: `cooldownPending`,
          },
          FAIL: {
            target: 'cooldownFail',
            actions: [`resetHash`],
          },
        },
      },
      cooldownPending: {
        on: {
          SUCCESS: {
            target: 'cooldownSuccess',
          },
          FAIL: {
            target: 'cooldownFail',
            actions: [`resetHash`],
          },
        },
      },
      cooldownSuccess: {
        type: 'final',
      },
      cooldownFail: {
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
      waitForCooldown(ctx) {
        return !!ctx.hash
      },
    },
  }
)

export function currentPage(value: StateValue) {
  switch (value) {
    case 'idle':
      return 1
    case 'cooldown':
    case 'cooldownPending':
      return 2
    case 'cooldownSuccess':
    case 'cooldownFail':
      return 3
    default:
      assertUnreachable(value)
  }
}
