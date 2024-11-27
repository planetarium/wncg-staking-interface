import { useAtomValue } from 'jotai'

import { useAuth } from 'hooks'
import { slippageAtom } from 'states/system'
import { useJoinMath } from './useJoinMath'

export function useJoinPool(
  assets: Hash[],
  amountsIn: `${number}`[],
  isNative: boolean
) {
  const { account } = useAuth()

  const { joinPool: _joinPool } = useJoinMath(isNative)

  const slippage = useAtomValue(slippageAtom) ?? '0.5'

  async function joinPool() {
    try {
      if (!account) {
        throw Error('No account')
      }

      return await _joinPool({
        assets,
        amountsIn,
        account,
        slippage,
      })
    } catch (error) {
      throw error
    }
  }

  return joinPool
}
