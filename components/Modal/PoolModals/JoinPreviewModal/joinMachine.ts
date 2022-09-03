import { assign, createMachine } from 'xstate'
import { nanoid } from 'nanoid'

import { bnum } from 'utils/num'
import { getTokenIndex } from 'utils/token'
import {
  createEventlessTransitions,
  createTransitions,
  generateStateNames,
} from './utils'

export type JoinMachineContext = {
  amounts: string[]
  approvals: boolean[]
  nativeAssetIndex: number
  isNativeAsset: boolean
}

export function createJoinMachine(
  amounts: string[],
  poolTokenSymbols: string[],
  approvals: boolean[],
  nativeAssetIndex: number,
  isNativeAsset: boolean
) {
  const id = `#JoinPoolMachine.${nanoid()}`
  const states = buildStates(poolTokenSymbols)
  const actions = buildActions(poolTokenSymbols)
  const guards = buildGuards(poolTokenSymbols)

  return createMachine<JoinMachineContext>(
    {
      predictableActionArguments: true,
      id,
      initial: 'idle',
      context: {
        amounts,
        approvals,
        isNativeAsset,
        nativeAssetIndex,
      },
      states,
    },
    {
      actions,
      guards,
    }
  )
}

function canJoin(ctx: JoinMachineContext) {
  return ctx.amounts.every((amount, i) => {
    const bAmount = bnum(amount)
    if (i === ctx.nativeAssetIndex && ctx.isNativeAsset) return true
    if (bAmount.gt(0)) return ctx.approvals[i]
    return true
  })
}

function createShouldApprove(tokenIndex: number) {
  return function (ctx: JoinMachineContext): boolean {
    if (ctx.approvals[tokenIndex]) return false
    if (ctx.nativeAssetIndex === tokenIndex && ctx.isNativeAsset) return false
    if (bnum(ctx.amounts[tokenIndex]).isZero()) return false

    const prevIndex = tokenIndex - 1
    if (prevIndex < 0) return true

    const prevIndexArray = Array.from(Array(tokenIndex).keys())
    return prevIndexArray.every((index) => !createShouldApprove(index)(ctx))
  }
}

function createUpdateApproval(tokenIndex: number) {
  return assign<JoinMachineContext>({
    approvals: (ctx) => {
      const newApprovals = [...ctx.approvals]
      newApprovals[tokenIndex] = true
      return newApprovals
    },
  })
}

function buildActions(poolTokenSymbols: string[]) {
  const entries = poolTokenSymbols.map((symbol, i) => [
    `update${symbol}Approval`,
    createUpdateApproval(i),
  ])
  return Object.fromEntries(entries)
}

function buildGuards(poolTokenSymbols: string[]) {
  const entries = poolTokenSymbols.map((symbol, i) => {
    const guardType = `shouldApprove${symbol}`
    return [guardType, createShouldApprove(i)]
  })

  return {
    canJoin,
    ...Object.fromEntries(entries),
  }
}

function buildStates(poolTokenSymbols: string[]) {
  const stateNames = generateStateNames(poolTokenSymbols)
  const stateEntries = stateNames.map((state) => {
    if (state === 'completed') {
      return [state, { type: 'final' }]
    }
    const tokenIndex = getTokenIndex(poolTokenSymbols, state)
    const always = createEventlessTransitions(
      poolTokenSymbols,
      state,
      tokenIndex
    )
    const events = createTransitions(poolTokenSymbols, state, tokenIndex)

    const definitions = { always, on: events }
    const entries = Object.entries(definitions).filter(([, value]) => {
      if (value instanceof Array) return !!value.length
      return !!Object.keys(value).length
    })

    return [state, Object.fromEntries(entries)]
  })

  return Object.fromEntries(stateEntries)
}
