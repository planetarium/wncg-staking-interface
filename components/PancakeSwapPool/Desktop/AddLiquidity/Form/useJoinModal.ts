import { useMemo } from 'react'

import { ModalType } from 'config/constants'
import { bnum } from 'utils/bnum'
import { useAllowances, useChain, useModal, useStaking } from 'hooks'
import { DEX_PROTOCOL_ADDRESS } from 'config/constants/addresses'

type OpenJoinParams = {
  joinAmounts: string[]
  joinAmountsInFiatValue: string[]
  lpTokenBalance: string
  totalJoinFiatValue: string
  resetForm(): void
}

export function useJoinModal(joinAmounts: string[]) {
  const allowanceFor = useAllowances()
  const { chainId } = useChain()
  const { addModal } = useModal()
  const { poolTokens } = useStaking()

  const shouldApprove = useMemo(
    () =>
      poolTokens.filter((t, i) =>
        bnum(allowanceFor(t.address, DEX_PROTOCOL_ADDRESS[chainId])).lt(
          joinAmounts[i]
        )
      ),
    [allowanceFor, chainId, joinAmounts, poolTokens]
  )

  function openJoin(params: OpenJoinParams) {
    const addLiquidityConfig = {
      type: ModalType.Join,
      props: params,
    }

    if (shouldApprove.length === 0) {
      addModal(addLiquidityConfig)
      return
    }

    const titleSuffix = ' to join pool'

    const spender = DEX_PROTOCOL_ADDRESS[chainId]
    const spenderName = 'join pool'
    const toastLabel = 'join pool'
    const buttonLabel = 'Join pool'

    addModal({
      type: ModalType.Approve,
      props: {
        spender,
        spenderName,
        tokenAddress: shouldApprove[0].address,
        tokenSymbol: shouldApprove[0].symbol,
        tokenDecimals: shouldApprove[0].decimals,
        titleSuffix,
        buttonLabel: shouldApprove[1]
          ? `Go to ${shouldApprove[1].symbol} approval`
          : buttonLabel,
        toastLabel,
        nextAction: shouldApprove[1]
          ? {
              type: ModalType.Approve,
              props: {
                spender,
                spenderName,
                buttonLabel,
                toastLabel,
                tokenDecimals: shouldApprove[1].decimals,
                tokenAddress: shouldApprove[1].address,
                tokenSymbol: shouldApprove[1].symbol,
                titleSuffix,
                nextAction: addLiquidityConfig,
              },
            }
          : addLiquidityConfig,
      },
    })
  }

  return openJoin
}
