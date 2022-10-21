import { createMachine } from 'xstate'
import type { StateValue } from 'xstate'
import { nanoid } from 'nanoid'

import { assertUnreachable } from 'utils/assertion'
import {
  approveGuards,
  approveStates,
  approveTransitions,
  joinStates,
} from './utils'
import type { JoinMachineContext } from './utils'

export function joinMachine(tokensToApprove: string[]) {
  const approvals = tokensToApprove.map((_) => false)

  return createMachine<JoinMachineContext>(
    {
      predictableActionArguments: true,
      id: `joinMachine:${nanoid()}`,
      initial: 'idle',
      context: {
        approvals,
        tokensToApprove,
        hash: undefined,
      },
      states: {
        idle: {
          always: [
            {
              target: `join`,
              cond: `hasApprovedAll`,
            },
            {
              target: `joinPending`,
              cond: `waitForJoin`,
            },
            ...approveTransitions(tokensToApprove),
          ],
        },
        ...approveStates(tokensToApprove),
        ...joinStates,
      },
    },
    {
      guards: {
        hasApprovedAll(ctx) {
          return !ctx.hash && !tokensToApprove.length
        },
        waitForJoin(ctx) {
          return !!ctx.hash && !tokensToApprove.length
        },
        ...approveGuards(tokensToApprove),
      },
    }
  )
}

export function currentPage(value: StateValue) {
  const state = value as string

  switch (true) {
    case state === 'idle':
      return 0
    case state.startsWith('approve0x'):
    case state.startsWith('approvePending:'):
      return 1
    case state.startsWith('approveSuccess:'):
    case state.startsWith('approveFail:'):
      return 2
    case state === 'join':
    case state === 'joinPending':
      return 3
    case state === 'joinSuccess':
    case state === 'joinFail':
      return 4
    default:
      assertUnreachable(state)
  }
}
