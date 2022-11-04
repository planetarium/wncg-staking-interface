import { createMachine } from 'xstate'

export const txButtonMachine = createMachine(
  {
    id: 'txButtonMachine',
    initial: 'idle',
    context: {
      isPending: false,
    },
    states: {
      idle: {
        always: [{ target: 'pending', cond: 'hasPendingRequest' }],
        on: {
          CALL: {
            target: 'called',
          },
        },
      },
      called: {
        on: {
          REJECT: {
            target: 'rejected',
          },
          CONFIRM: {
            target: 'pending',
          },
        },
      },
      pending: {
        on: {
          COMPLETE: {
            target: 'completed',
          },
        },
      },
      rejected: {
        on: {
          CALL: {
            target: 'called',
          },
        },
      },
      completed: {
        type: 'final',
      },
    },
  },
  {
    guards: {
      hasPendingRequest(ctx) {
        return !!ctx.isPending
      },
    },
  }
)
