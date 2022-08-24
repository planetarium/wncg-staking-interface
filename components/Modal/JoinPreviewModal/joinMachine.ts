import { assign, createMachine } from 'xstate'
import { bnum } from 'utils/num'

export type JoinMachineContext = {
  amounts: string[]
  approvals: boolean[]
  isNativeAsset: boolean
}

export function createJoinMachine(
  amounts: string[],
  approvals: boolean[],
  isNativeAsset: boolean
) {
  return createMachine<JoinMachineContext>(
    {
      id: '#JoinPoolMachine',
      initial: 'idle',
      context: {
        amounts,
        approvals,
        isNativeAsset,
      },
      states: {
        idle: {
          always: [
            {
              target: 'join',
              cond: 'canJoin',
            },
            {
              target: 'approveWncg',
              cond: 'shouldApproveWncg',
            },
            {
              target: 'approveWeth',
              cond: 'shouldApproveWeth',
            },
          ],
        },
        approveWncg: {
          on: {
            APPROVING_WNCG: 'approvingWncg',
          },
        },
        approvingWncg: {
          always: [
            {
              target: 'join',
              cond: 'canJoin',
            },
            {
              target: 'approveWeth',
              cond: 'shouldApproveWeth',
            },
          ],
          on: {
            APPROVED_WNCG: {
              actions: 'updateWncgApproval',
            },
            ROLLBACK: 'approveWncg',
          },
        },
        approveWeth: {
          on: {
            APPROVING_WETH: 'approvingWeth',
          },
        },
        approvingWeth: {
          always: {
            target: 'join',
            cond: 'canJoin',
          },
          on: {
            APPROVED_WETH: {
              actions: 'updateWethApproval',
            },
            ROLLBACK: 'approveWeth',
          },
        },
        join: {
          on: {
            JOINING: 'joining',
          },
        },
        joining: {
          on: {
            COMPLETED: 'completed',
            ROLLBACK: 'join',
          },
        },
        completed: {
          type: 'final',
        },
      },
    },
    {
      actions: {
        updateWethApproval,
        updateWncgApproval,
      },
      guards: {
        canJoin,
        shouldApproveWeth,
        shouldApproveWncg,
      },
    }
  )
}

function canJoin(ctx: JoinMachineContext) {
  return ctx.amounts.every((amount, i) => {
    const givenAmount = bnum(amount)
    if (i === 1 && ctx.isNativeAsset) return true
    if (givenAmount.gt(0)) return ctx.approvals[i]
    return true
  })
}

function shouldApproveWncg(ctx: JoinMachineContext) {
  return !ctx.approvals[0] && !bnum(ctx.amounts[0]).isZero()
}

function shouldApproveWeth(ctx: JoinMachineContext) {
  if (ctx.approvals[1]) return false
  if (ctx.isNativeAsset) return false
  if (bnum(ctx.amounts[1]).isZero()) return false
  if (shouldApproveWncg(ctx)) return false
  return true
}

const updateWncgApproval = assign<JoinMachineContext>({
  approvals: (ctx) => {
    const newApprovals = [...ctx.approvals]
    newApprovals[0] = true
    return newApprovals
  },
})

const updateWethApproval = assign<JoinMachineContext>({
  approvals: (ctx) => {
    const newApprovals = [...ctx.approvals]
    newApprovals[1] = true
    return newApprovals
  },
})
