import { formatUnits, parseUnits } from 'ethers/lib/utils'
import OldBigNumber from 'bignumber.js'

import { bnum } from 'utils/num'

export function useSlippage() {
  // TODO: should be onfigurable
  const slippage = 0.005

  function addSlippageScaled(amount: string) {
    const delta = bnum(amount).times(slippage).dp(0, OldBigNumber.ROUND_DOWN)
    return bnum(amount).plus(delta).toString()
  }

  function addSlippage(_amount: string, decimals: number) {
    let amount = parseUnits(_amount, decimals).toString()
    amount = addSlippageScaled(amount)
    return formatUnits(amount, decimals)
  }

  function minusSlippageScaled(amount: string) {
    const delta = bnum(amount).times(slippage).dp(0, OldBigNumber.ROUND_UP)
    return bnum(amount).minus(delta).toString()
  }

  function minusSlippage(_amount: string, decimals: number) {
    let amount = parseUnits(_amount, decimals).toString()
    amount = minusSlippageScaled(amount)
    return formatUnits(amount, decimals)
  }

  return {
    addSlippage,
    addSlippageScaled,
    minusSlippage,
    minusSlippageScaled,
  }
}
