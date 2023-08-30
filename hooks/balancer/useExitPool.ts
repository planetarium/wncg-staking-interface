import { bnum } from 'utils/bnum'
import { useAuth, useBalances, useStaking } from 'hooks'
import { useExitMath } from './useExitMath'
import { useAtomValue } from 'jotai'
import { calcSlippageBsp } from 'utils/calcSlippageBsp'
import { slippageAtom } from 'states/system'

type UseExitPoolParams = {
  assets: Hash[]
  bptOutPcnt: string
  exitAmounts: string[]
  exitType: Hash | null
}

export function useExitPool({
  assets,
  bptOutPcnt,
  exitType,
  exitAmounts,
}: UseExitPoolParams) {
  // const { account } = useAuth()
  // const balanceOf = useBalances()
  // const { tokens, lpToken } = useStaking()
  // const { exactExitIn, exactExitOut } = useExitMath()
  // const userLpBalance = balanceOf(lpToken.address)
  // const slippage = useAtomValue(slippageAtom) ?? '0.5'
  // const slippageBsp = calcSlippageBsp(slippage)
  // async function exitPool() {
  //   try {
  //     if (!account) {
  //       throw Error('No account')
  //     }
  //     const exit = exitType == null ? exactExitIn : exactExitOut
  //     return await exit({
  //       assets: assets.map((a) => tokens[a]),
  //       bptIn:
  //         exitType == null
  //           ? bnum(bptOutPcnt).times(userLpBalance).toString()
  //           : '0',
  //       amountsOut: exitAmounts,
  //       account,
  //       slippageBsp,
  //     })
  //   } catch (error) {
  //     throw error
  //   }
  // }
  // return exitPool
}
