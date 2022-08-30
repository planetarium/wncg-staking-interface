import { useCallback, useMemo, useRef } from 'react'
import { useMachine } from '@xstate/react'

import { ModalCategory } from 'app/states/modal'
import { configService } from 'services/config'
import { bnum } from 'utils/num'
import {
  useAllowances,
  useApprove,
  useJoinPool,
  useModal,
  usePool,
} from 'hooks'
import { createJoinMachine } from './joinMachine'
import { getSymbolNameFromState, isApprovalState } from './utils'

export function useJoinMachine(amounts: string[], isNativeAsset: boolean) {
  const { approve } = useApprove()
  const { poolTokenAllowances } = useAllowances()
  const { joinPool } = useJoinPool()
  const { removeModal } = useModal()
  const { nativeAssetIndex, poolTokenAddresses, poolTokenSymbols } = usePool()

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

      removeModal(ModalCategory.JoinPreview)
    } catch (error) {
      send(`ROLLBACK`)
      throw error
    }
  }, [
    amounts,
    approve,
    isNativeAsset,
    joinPool,
    poolTokenAddresses,
    poolTokenSymbols,
    removeModal,
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
    handleJoin,
    send,
    state,
    stepsToSkip,
  }
}
