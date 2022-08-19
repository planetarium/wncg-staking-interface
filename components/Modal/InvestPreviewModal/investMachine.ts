import { assign, createMachine } from 'xstate'
import { bnum } from 'utils/num'

export type InvestMachineContext = {
  amounts: string[]
  approvals: boolean[]
  currentEthType: EthType
}

export function createInvestMachine(
  amounts: string[],
  approvals: boolean[],
  currentEthType: EthType
) {
  return createMachine<InvestMachineContext>(
    {
      id: '#investMachine',
      initial: 'idle',
      context: {
        amounts,
        approvals,
        currentEthType,
      },
      states: {
        idle: {
          always: [
            {
              target: 'invest',
              cond: 'canInvest',
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
              target: 'invest',
              cond: 'canInvest',
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
          },
        },
        approveWeth: {
          on: {
            APPROVING_WETH: 'approvingWeth',
          },
        },
        approvingWeth: {
          always: {
            target: 'invest',
            cond: 'canInvest',
          },
          on: {
            APPROVED_WETH: {
              actions: 'updateWethApproval',
            },
          },
        },
        invest: {
          on: {
            INVESTING: 'investing',
          },
        },
        investing: {
          on: {
            COMPLETED: 'completed',
          },
        },
        completed: {},
      },
    },
    {
      actions: {
        updateWethApproval,
        updateWncgApproval,
      },
      guards: {
        canInvest,
        shouldApproveWeth,
        shouldApproveWncg,
      },
    }
  )
}

function canInvest(ctx: InvestMachineContext, event: any) {
  return ctx.amounts.every((amount, i) => {
    const givenAmount = bnum(amount)
    if (i === 1 && ctx.currentEthType === 'eth') return true
    if (givenAmount.gt(0)) return ctx.approvals[i]
    return true
  })
}

function shouldApproveWncg(ctx: InvestMachineContext) {
  return !ctx.approvals[0] && !bnum(ctx.amounts[0]).isZero()
}

function shouldApproveWeth(ctx: InvestMachineContext) {
  if (ctx.approvals[1]) return false
  if (ctx.currentEthType === 'eth') return false
  if (bnum(ctx.amounts[1]).isZero()) return false
  if (shouldApproveWncg(ctx)) return false
  return true
}

const updateWncgApproval = assign<InvestMachineContext>({
  approvals: (ctx) => {
    const newApprovals = [...ctx.approvals]
    newApprovals[0] = true
    return newApprovals
  },
})

const updateWethApproval = assign<InvestMachineContext>({
  approvals: (ctx) => {
    const newApprovals = [...ctx.approvals]
    newApprovals[1] = true
    return newApprovals
  },
})
