import type { StateValue } from 'xstate'

import { assertUnreachable } from 'utils/assertion'

const JOIN_GUARD = {
  target: 'join',
  cond: { type: 'canJoin' },
}

export function createTransitions(
  poolTokenSymbols: string[],
  state: string,
  tokenIndex: number
) {
  if (['idle', 'completed'].includes(state)) return {}

  if (state === 'join') {
    return {
      JOINING: 'joining',
    }
  }

  if (state === 'joining') {
    return {
      COMPLETED: 'completed',
      ROLLBACK: 'join',
    }
  }

  const symbol = poolTokenSymbols[tokenIndex]

  if (state.includes('approve')) {
    return {
      [`APPROVING_${symbol}`]: `approving${symbol}`,
    }
  }

  if (state.includes('approving')) {
    return {
      [`APPROVED_${symbol}`]: {
        actions: `update${symbol}Approval`,
      },
      ROLLBACK: `approve${symbol}`,
    }
  }

  return {}
}

export function createEventlessTransitions(
  poolTokenSymbols: string[],
  state: string,
  tokenIndex: number
) {
  if (state === 'join') return []
  if (state === 'idle') {
    return [
      JOIN_GUARD,
      ...poolTokenSymbols.map((symbol) => ({
        target: `approve${symbol}`,
        cond: {
          type: `shouldApprove${symbol}`,
        },
      })),
    ]
  }
  if (!state.includes('approving')) return []

  const lastTokenIndex = poolTokenSymbols.length - 1
  const tokensToCheck = Array.from(
    Array(lastTokenIndex - tokenIndex).keys()
  ).map((key) => key + 1 + tokenIndex)

  return [
    JOIN_GUARD,
    ...tokensToCheck.map((index) => {
      const symbol = poolTokenSymbols[index]
      return {
        target: `approve${symbol}`,
        cond: `shouldApprove${symbol}`,
      }
    }),
  ]
}

export function generateStateNames(poolTokenSymbols: string[]) {
  const approvalStates = poolTokenSymbols.flatMap((symbol) => {
    return [`approve${symbol}`, `approving${symbol}`]
  })
  return ['idle', ...approvalStates, 'join', 'joining', 'completed']
}

const regexList = [/approve/, /approving/]

export function getSymbolNameFromState(_state: StateValue) {
  const state = _state as string
  let symbol = ''

  regexList.forEach((regex) => {
    if (state.match(regex)) {
      symbol = state.replace(regex, '')
    }
  })
  return symbol
}

export function isApprovalState(state: StateValue) {
  return /approve/.test(state as string)
}

export function isApprovingState(state: StateValue) {
  return /approving/.test(state as string)
}

export function getJoinActionButtonLabel(state: StateValue) {
  if (isApprovalState(state)) {
    return `Approve ${getSymbolNameFromState(state as string)}`
  }

  if (isApprovingState(state)) {
    return `Approving ${getSymbolNameFromState(state as string)}`
  }

  switch (state) {
    case 'idle':
      return 'Close'
    case 'join':
      return 'Join pool'
    case 'joining':
      return 'Joining pool'
    case 'completed':
      return 'Close'
    default:
      assertUnreachable(state)
  }
}
