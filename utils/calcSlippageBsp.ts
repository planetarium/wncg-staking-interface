import { bnum } from './bnum'

export function calcSlippageBsp(slippage: string) {
  return bnum(slippage).times(10000).toString()
}
