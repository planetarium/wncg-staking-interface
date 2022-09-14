import { useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import BigNumber from 'bignumber.js'

import { slippageSelector } from 'app/states/settings'
import { bnum } from 'utils/num'

export function useSlippage() {
  const slippage = useRecoilValue(slippageSelector)
  const slippageBasisPoints = bnum(slippage).div(100).toNumber()

  const addSlippageScaled = useCallback(
    (amount: string) => {
      const delta = bnum(amount)
        .times(slippageBasisPoints)
        .dp(0, BigNumber.ROUND_DOWN)
      return bnum(amount).plus(delta).toString()
    },
    [slippageBasisPoints]
  )

  const addSlippage = useCallback(
    (_amount: string, decimals: number) => {
      let amount = parseUnits(_amount, decimals).toString()
      amount = addSlippageScaled(amount)
      return formatUnits(amount, decimals)
    },
    [addSlippageScaled]
  )

  const minusSlippageScaled = useCallback(
    (amount: string) => {
      const delta = bnum(amount)
        .times(slippageBasisPoints)
        .dp(0, BigNumber.ROUND_UP)
      return bnum(amount).minus(delta).toString()
    },
    [slippageBasisPoints]
  )

  const minusSlippage = useCallback(
    (_amount: string, decimals: number) => {
      let amount = parseUnits(_amount, decimals).toString()
      amount = minusSlippageScaled(amount)
      return formatUnits(amount, decimals)
    },
    [minusSlippageScaled]
  )

  return {
    addSlippage,
    addSlippageScaled,
    minusSlippage,
    minusSlippageScaled,
  }
}
