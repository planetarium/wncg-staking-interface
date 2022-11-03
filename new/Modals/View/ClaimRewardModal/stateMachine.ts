import { assign, createMachine, StateValue } from 'xstate'

import { assertUnreachable } from 'utils/assertion'

type ClaimMachineContext = {
  hash?: string
}

export const claimMachine = createMachine<ClaimMachineContext>(
  {
    predictableActionArguments: true,
    id: `claimMachine`,
    initial: `claim`,
    context: {
      hash: undefined,
    },
    states: {
      claim: {
        always: [{ target: `claimPending`, cond: `waitForClaim` }],
        on: {
          CALL: {
            target: `claimPending`,
          },
          FAIL: {
            target: `claimFail`,
            actions: [`resetHash`],
          },
        },
      },
      claimPending: {
        on: {
          SUCCESS: {
            target: 'claimSuccess',
            actions: [`resetHash`],
          },
          FAIL: {
            target: 'claimFail',
            actions: [`resetHash`],
          },
        },
      },
      claimSuccess: {
        type: 'final',
      },
      claimFail: {
        type: 'final',
      },
    },
  },
  {
    actions: {
      resetHash: assign<ClaimMachineContext>({
        hash: undefined,
      }),
    },
    guards: {
      waitForClaim(ctx) {
        return !!ctx.hash
      },
    },
  }
)

export function currentPage(value: StateValue) {
  switch (value) {
    case 'claim':
    case 'claimPending':
      return 1
    case 'claimSuccess':
    case 'claimFail':
      return 2
    default:
      assertUnreachable(value)
  }
}
