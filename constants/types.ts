export const UnstakePhase = {
  Idle: 'UNSTAKE_PHASE_IDLE',
  CooldownWindow: 'UNSTAKE_PHASE_COOLDOWN_WINDOW',
  WithdrawWindow: 'UNSTAKE_PHASE_WITHDRAW_WINDOW',
} as const

export type UnstakePhase = typeof UnstakePhase[keyof typeof UnstakePhase]
