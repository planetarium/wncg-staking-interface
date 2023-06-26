import { useMemo } from 'react'
import { useSetAtom } from 'jotai'

import { showPoolAtom } from 'states/ui'
import { ModalType } from 'config/constants'
import { DEX_PROTOCOL_ADDRESS } from 'config/constants/addresses'
import { bnum } from 'utils/bnum'
import {
  useAllowances,
  useChain,
  useModal,
  useResponsive,
  useStaking,
} from 'hooks'

export function useAddLiquidityModal(assets: Hash[], amountsIn: string[]) {
  const allowanceOf = useAllowances()
  const { chainId, nativeCurrency } = useChain()
  const { addModal } = useModal()
  const { isMobile } = useResponsive()
  const { tokens, shouldReversePoolTokenOrderOnDisplay } = useStaking()

  const setShowPool = useSetAtom(showPoolAtom)

  const spender = DEX_PROTOCOL_ADDRESS[chainId]!

  const tokensToApprove = useMemo(() => {
    const list = assets
      .filter((addr, i) => {
        if (addr === nativeCurrency.address) return false
        return bnum(allowanceOf(addr, spender)).lt(amountsIn[i])
      })
      .map((addr) => tokens[addr])

    return shouldReversePoolTokenOrderOnDisplay ? list.reverse() : list
  }, [
    assets,
    shouldReversePoolTokenOrderOnDisplay,
    nativeCurrency.address,
    allowanceOf,
    spender,
    amountsIn,
    tokens,
  ])

  function openAddLiquidityModal(params: {
    assets: Hash[]
    amountsIn: string[]
    userLpAmount: string
    amountsInFiatValueSum: string
    resetForm(): void
  }) {
    if (isMobile) setShowPool(false)

    const addLiqConfig = {
      type: ModalType.AddLiquidity,
      props: params,
    }

    if (tokensToApprove.length === 0) {
      addModal(addLiqConfig)
      return
    }

    const titleSuffix = ' to join pool'
    const spenderName = 'join pool'
    const toastLabel = spenderName
    const buttonLabel = 'Join pool'

    addModal({
      type: ModalType.Approve,
      props: {
        spender,
        spenderName,
        tokenAddress: tokensToApprove[0].address,
        tokenSymbol: tokensToApprove[0].symbol,
        tokenDecimals: tokensToApprove[0].decimals,
        titleSuffix,
        buttonLabel: tokensToApprove[1]
          ? `Go to ${tokensToApprove[1].symbol} approval`
          : buttonLabel,
        toastLabel,
        nextAction: tokensToApprove[1]
          ? {
              type: ModalType.Approve,
              props: {
                spender,
                spenderName,
                buttonLabel,
                toastLabel,
                tokenDecimals: tokensToApprove[1].decimals,
                tokenAddress: tokensToApprove[1].address,
                tokenSymbol: tokensToApprove[1].symbol,
                titleSuffix,
                nextAction: addLiqConfig,
              },
            }
          : addLiqConfig,
      },
    })
  }

  return openAddLiquidityModal
}
