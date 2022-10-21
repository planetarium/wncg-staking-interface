import { assign } from 'xstate'

export type JoinMachineContext = {
  approvals: boolean[]
  tokensToApprove: string[]
  hash?: string
}

export const joinStates = Object.freeze({
  join: {
    on: {
      CALL: {
        target: 'joinPending',
      },
      FAIL: {
        target: 'joinFail',
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
      },
    },
  },
  joinSuccess: {
    type: 'final' as StateType<JoinMachineContext>,
  },
  joinFail: {
    type: 'final' as StateType<JoinMachineContext>,
  },
})

export function approveStates(tokensToApprove: string[]) {
  return tokensToApprove.reduce((acc, token, i) => {
    const nextIndex = i + 1
    const states = {
      [`approve${token}`]: {
        on: {
          CALL: {
            target: `approvePending:${token}`,
          },
          FAIL: {
            target: `approveFail:${token}`,
          },
        },
      },
      [`approvePending:${token}`]: {
        always: [
          {
            target: `approveSuccess:${token}`,
            cond: `hasApproved:${token}`,
          },
        ],
        on: {
          SUCCESS: {
            target: `approveSuccess:${token}`,
            actions: assign<JoinMachineContext>({
              approvals: (ctx) => {
                ctx.approvals[i] = true
                return ctx.approvals
              },
            }),
          },
          FAIL: {
            target: `approveFail:${token}`,
          },
        },
      },
      [`approveSuccess:${token}`]: {
        on: {
          NEXT: {
            target: tokensToApprove[nextIndex]
              ? `approve${tokensToApprove[nextIndex]}`
              : `join`,
          },
        },
      },
      [`approveFail:${token}`]: {
        type: 'final' as StateType<JoinMachineContext>,
      },
    }

    return {
      ...acc,
      ...states,
    }
  }, {})
}

export function approveTransitions(tokensToApprove: string[]) {
  return tokensToApprove.flatMap((token) => [
    { target: `approve${token}`, cond: `hasNotApproved:${token}` },
    { target: `approvePending:${token}`, cond: `waitForApproval:${token}` },
  ])
}

export function approveAction(token: string, i: number) {
  return assign<JoinMachineContext>({
    approvals: (ctx) => {
      console.log('change approval context:', i, token.slice(0, 6))

      const newApprovals = [...ctx.approvals]
      newApprovals[i] = true
      console.log('>>>> changed context:', newApprovals)

      return newApprovals
    },
  })
}

export function approveGuards<T extends JoinMachineContext>(
  tokensToApprove: string[]
) {
  return tokensToApprove.reduce((acc, token, i) => {
    return {
      ...acc,
      [`hasNotApproved:${token}`](ctx: T) {
        return !ctx.hash && !ctx.approvals[i]
      },
      [`hasApproved:${token}`](ctx: T) {
        return !ctx.hash && !!ctx.approvals[i]
      },
      [`waitForApproval:${token}`](ctx: T) {
        console.log(`waitForApproval?:`, ctx.hash)

        return !!ctx.hash && !ctx.approvals[i]
      },
    }
  }, {})
}

export function extractTokenAddress(value: string) {
  return value.match(/0x\S+/gi)?.[0] ?? ''
}
