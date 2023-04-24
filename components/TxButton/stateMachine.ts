import { createMachine } from 'xstate'

type TxButtonMachineContext = {
  hash?: Hash
}

export const txButtonMachine = createMachine<TxButtonMachineContext>(
  {
    id: 'txButtonMachine',
    initial: 'idle',
    predictableActionArguments: true,
    context: {
      hash: undefined,
    },
    states: {
      idle: {
        always: [{ target: 'pending', cond: 'txPending' }],
        on: {
          NEXT: {
            target: 'called',
          },
        },
      },
      called: {
        on: {
          NEXT: {
            target: 'pending',
          },
          ROLLBACK: {
            target: 'idle',
          },
        },
      },
      pending: {
        on: {
          NEXT: {
            target: 'done',
          },
          ROLLBACK: {
            target: 'called',
          },
        },
      },
      done: {
        type: 'final',
      },
    },
  },
  {
    guards: {
      txPending(ctx) {
        return !!ctx.hash
      },
    },
  }
)
