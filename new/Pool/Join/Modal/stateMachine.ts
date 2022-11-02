import { assign, createMachine } from 'xstate'
import type { StateValue } from 'xstate'

import { assertUnreachable } from 'utils/assertion'

export type JoinMachineContext = {
  amounts: string[]
  assets: string[]
  tokensToApprove: string[]
  hash?: string
}

export const joinMachine = createMachine<JoinMachineContext>(
  {
    predictableActionArguments: true,
    id: `joinMachine`,
    initial: `idle`,
    context: {
      amounts: [],
      assets: [],
      tokensToApprove: [],
      hash: undefined,
    },
    states: {
      idle: {
        always: [
          { target: `approvePending`, cond: `waitForApproval` },
          { target: `approve`, cond: `shouldApprove` },
          { target: 'joinPending', cond: `waitForJoin` },
          { target: 'join', cond: `readyToJoin` },
        ],
      },
      approve: {
        on: {
          CALL: {
            target: `approvePending`,
          },
          FAIL: {
            target: 'approveFail',
            actions: [`resetHash`],
          },
        },
      },
      approvePending: {
        on: {
          SUCCESS: {
            target: 'approveSuccess',
            actions: [`approve`],
          },
          FAIL: {
            target: 'approveFail',
            actions: [`resetHash`],
          },
        },
      },
      approveSuccess: {
        on: {
          NEXT: [
            { target: 'join', cond: `readyToJoin` },
            { target: `approve`, cond: `shouldApprove` },
          ],
        },
      },
      approveFail: {
        type: 'final',
      },
      join: {
        on: {
          CALL: {
            target: 'joinPending',
          },
          FAIL: {
            target: 'joinFail',
            actions: [`resetHash`],
          },
        },
      },
      joinPending: {
        on: {
          SUCCESS: {
            target: 'joinSuccess',
          },
          FAIL: {
            target: 'joinFail',
            actions: [`resetHash`],
          },
        },
      },
      joinSuccess: {
        type: 'final',
      },
      joinFail: {
        type: 'final',
      },
    },
  },
  {
    actions: {
      approve: assign<JoinMachineContext>({
        tokensToApprove(ctx) {
          const newTokensToApprove = [...ctx.tokensToApprove]
          newTokensToApprove.shift()
          return newTokensToApprove
        },
        hash: undefined,
      }),
      resetHash: assign<JoinMachineContext>({
        hash: undefined,
      }),
    },
    guards: {
      readyToJoin(ctx) {
        return !ctx.tokensToApprove.length
      },
      waitForJoin(ctx) {
        return !!ctx.hash && !ctx.tokensToApprove.length
      },
      shouldApprove(ctx) {
        return !ctx.hash && ctx.tokensToApprove[0] != null
      },
      waitForApproval(ctx) {
        return !!ctx.hash && ctx.tokensToApprove[0] != null
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
    case 'join':
    case 'joinPending':
      return 3
    case 'joinSuccess':
    case 'joinFail':
      return 4
    default:
      assertUnreachable(value)
  }
}
