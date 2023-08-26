import { useAtomValue } from 'jotai'

import { slippageAtom } from 'states/system'
import { calcSlippageBsp } from 'utils/calcSlippageBsp'
import { useAuth } from 'hooks'
import { useJoinMath } from './useJoinMath'

export function useJoinPool(
  assets: Hash[],
  amountsIn: string[],
  isNative: boolean
) {
  const { account } = useAuth()

  const { join } = useJoinMath(isNative)

  const slippage = useAtomValue(slippageAtom) ?? '0.5'
  const slippageBsp = calcSlippageBsp(slippage)

  async function joinPool() {
    try {
      if (!account) {
        throw Error('No account')
      }

      return await join({
        assets,
        amountsIn,
        account,
        slippageBsp,
      })
    } catch (error) {
      throw error
    }
  }

  return joinPool
}
