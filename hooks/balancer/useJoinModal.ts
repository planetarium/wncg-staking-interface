import { useMemo } from 'react'
import { useSetAtom } from 'jotai'

import { showPoolAtom } from 'states/ui'
import { ModalType } from 'config/constants'
import { bnum } from 'utils/bnum'
import { useAllowances, useModal, useResponsive, useStaking } from 'hooks'

export function useJoinModal(assets: Hash[], joinAmounts: string[]) {
  const allowanceFor = useAllowances()
  const { addModal } = useModal()
  const { isMobile } = useResponsive()
  const { tokens, balancerGaugeAddress } = useStaking<'ethereum'>()

  const setShowPool = useSetAtom(showPoolAtom)

  const shouldApprove = useMemo(
    () =>
      assets.filter((addr, i) => {
        return bnum(allowanceFor(addr, balancerGaugeAddress)).lt(joinAmounts[i])
      }),
    [allowanceFor, assets, balancerGaugeAddress, joinAmounts]
  )

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

    const spender = balancerGaugeAddress

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
                spender: balancerGaugeAddress,
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
