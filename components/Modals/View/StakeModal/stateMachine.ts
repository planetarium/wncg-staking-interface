import { assign, createMachine, StateValue } from 'xstate'

import { assertUnreachable } from 'utils/assertUnreachable'

type StakeMachineContext = {
  confirmed?: boolean
  hash?: string
  unstakeWindow?: boolean
}

export const stakeMachine = createMachine<StakeMachineContext>(
  {
    predictableActionArguments: true,
    id: `stakeMachine`,
    initial: 'idle',
    context: {
      confirmed: undefined,
      hash: undefined,
      unstakeWindow: undefined,
    },
    states: {
      idle: {
        always: [
          {
            target: 'preview',
            cond: 'unstakeWindowClosed',
          },
          {
            target: 'pending',
            cond: 'txPending',
          },
        ],
        on: {
          NEXT: {
            target: 'preview',
            actions: [`confirm`],
          },
        },
      },
      preview: {
        always: [
          {
            target: 'idle',
            cond: 'unstakeWindowOpened',
          },
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
        type: 'final',
      },
      fail: {
        type: 'final',
      },
    },
  },
  {
    actions: {
      resetHash: assign<StakeMachineContext>({
        hash: undefined,
      }),
      confirm: assign<StakeMachineContext>({
        confirmed: true,
      }),
    },
    guards: {
      txPending(ctx) {
        return !!ctx.hash
      },
      unstakeWindowClosed(ctx) {
        return !ctx.unstakeWindow
      },
      unstakeWindowOpened(ctx) {
        return !!ctx.unstakeWindow && !ctx.confirmed
      },
    },
  }
)

export function pageFor(value: StateValue) {
  switch (value) {
    case 'idle':
      return 0
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
