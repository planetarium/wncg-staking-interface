import { useCallback, useMemo, useRef, useState } from 'react'
import { useMachine } from '@xstate/react'

import { configService } from 'services/config'
import { parseTxError } from 'utils/error'
import { bnum } from 'utils/num'
import {
  useAllowances,
  useApprove,
  useJoinPool,
  usePool,
  useToast,
} from 'hooks'
import { createJoinMachine } from './joinMachine'
import { getSymbolNameFromState, isApprovalState } from './utils'

export function useJoinMachine(amounts: string[], isNativeAsset: boolean) {
  const [error, setError] = useState<any>(null)
  const { approve } = useApprove()
  const { poolTokenAllowances } = useAllowances()
  const { joinPool } = useJoinPool()
  const { nativeAssetIndex, poolTokenAddresses, poolTokenSymbols } = usePool()
  const { addToast } = useToast()

  const joinMachine = useRef(
    createJoinMachine(
      amounts,
      poolTokenSymbols,
      poolTokenAllowances,
      nativeAssetIndex,
      isNativeAsset
    )
  )

  const [state, send] = useMachine(joinMachine.current)

  const handleJoin = useCallback(async () => {
    const currentState = state.value

    try {
      setError(null)
      if (isApprovalState(currentState)) {
        const symbol = getSymbolNameFromState(currentState)
        const tokenIndex = poolTokenSymbols.indexOf(symbol)
        const address = poolTokenAddresses[tokenIndex]

        if (!address) return

        send(`APPROVING_${symbol}`)
        return await approve(address, configService.vaultAddress)
      }

      if (currentState === 'join') {
        send(`JOINING`)
        return await joinPool(amounts, isNativeAsset)
      }
    } catch (error: any) {
      send(`ROLLBACK`)
      setError(error)
      const errorMsg = parseTxError(error)
      if (errorMsg) {
        addToast({
          ...errorMsg,
          type: 'error',
        })
      }
    }
  }, [
    addToast,
    amounts,
    approve,
    isNativeAsset,
    joinPool,
    poolTokenAddresses,
    poolTokenSymbols,
    send,
    state.value,
  ])

  const stepsToSkip = useMemo(
    () =>
      amounts.map((amount, i) => {
        if (i === nativeAssetIndex && isNativeAsset) return true
        if (!bnum(amount).isZero()) return false
        return true
      }),
    [amounts, isNativeAsset, nativeAssetIndex]
  )

  return {
    error,
    handleJoin,
    send,
    state,
    stepsToSkip,
  }
}
