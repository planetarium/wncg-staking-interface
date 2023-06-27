import { useMemo } from 'react'
import { useSetAtom } from 'jotai'

import { showPoolAtom } from 'states/ui'
import { ModalType } from 'config/constants'
import { bnum } from 'utils/bnum'
import {
  useAllowances,
  useChain,
  useModal,
  useResponsive,
  useStaking,
} from 'hooks'
import { DEX_PROTOCOL_ADDRESS } from 'config/constants/addresses'

export function useJoinModal(assets: Hash[], joinAmounts: string[]) {
  const allowanceOf = useAllowances()
  const { dexProtocolAddress } = useChain()
  const { addModal } = useModal()
  const { isMobile } = useResponsive()
  const { tokens, shouldReversePoolTokenOrderOnDisplay } =
    useStaking<'ethereum'>()

  const setShowPool = useSetAtom(showPoolAtom)

  const shouldApprove = useMemo(() => {
    const list = assets.filter((addr, i) => {
      return bnum(allowanceOf(addr, dexProtocolAddress)).lt(joinAmounts[i])
    })
    return shouldReversePoolTokenOrderOnDisplay ? list.reverse() : list
  }, [
    allowanceOf,
    assets,
    joinAmounts,
    shouldReversePoolTokenOrderOnDisplay,
    dexProtocolAddress,
  ])

  const tokensToApprove = useMemo(
    () => shouldApprove.map((addr) => tokens[addr]),
    [shouldApprove, tokens]
  )

  function openJoinModal(params: {
    assets: Hash[]
    joinAmounts: string[]
    lpBalance: string
    totalJoinFiatValue: string
    resetForm(): void
  }) {
    if (isMobile) setShowPool(false)

    const spender = dexProtocolAddress

    const joinModalConfig = {
      type: ModalType.Join,
      props: params,
    }

    if (shouldApprove.length === 0) {
      addModal(joinModalConfig)
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
                nextAction: joinModalConfig,
              },
            }
          : joinModalConfig,
      },
    })
  }

  return openJoinModal
}
