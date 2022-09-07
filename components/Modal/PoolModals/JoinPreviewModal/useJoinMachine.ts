import { useCallback, useMemo, useRef, useState } from 'react'
import { useMachine } from '@xstate/react'

import { configService } from 'services/config'
import { TxAction } from 'services/transaction'
import { parseTxError } from 'utils/error'
import { bnum } from 'utils/num'
import { txToastTitle } from 'utils/transaction'
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
  const { addTxToast } = useToast()

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
      if (error?.code === 4001) return
      const errorMsg = parseTxError(error)
      setError(error)
      addTxToast({
        action: TxAction.JoinPool,
        title: txToastTitle(TxAction.JoinPool, 'error'),
        message: errorMsg!.message,
        type: 'error',
      })
    }
  }, [
    addTxToast,
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
