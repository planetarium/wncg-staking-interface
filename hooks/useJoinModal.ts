import { useMemo } from 'react'
import { useSetAtom } from 'jotai'

import { showPoolAtom } from 'states/ui'
import config from 'config'
import { ModalType } from 'config/constants'
import { bnum } from 'utils/bnum'
import { useAllowances, useModal, useResponsive, useStaking } from 'hooks'

type OpenJoinParams = {
  assets: Hash[]
  joinAmounts: string[]
  joinAmountsInFiatValue: string[]
  bptBalance: string
  totalJoinFiatValue: string
  resetForm(): void
}

export function useJoinModal(assets: Hash[], joinAmounts: string[]) {
  const allowanceFor = useAllowances()
  const { addModal } = useModal()
  const { isMobile } = useResponsive()
  const { tokenMap } = useStaking()

  const setShowPool = useSetAtom(showPoolAtom)

  const shouldApprove = useMemo(
    () =>
      assets.filter((addr, i) => {
        return bnum(allowanceFor(addr, config.vault)).lt(joinAmounts[i])
      }),
    [allowanceFor, assets, joinAmounts]
  )

  const tokensToApprove = useMemo(
    () => shouldApprove.map((addr) => tokenMap[addr]),
    [shouldApprove, tokenMap]
  )

  function openJoin(params: OpenJoinParams) {
    if (isMobile) setShowPool(false)

    const joinModalConfig = {
      type: ModalType.Join,
      props: params,
    }

    if (shouldApprove.length === 0) {
      addModal(joinModalConfig)
      return
    }

    const titleSuffix = ' to join pool'
    const completeMessage =
      'Now you can join pool and no more approval is required for this smart contract.'

    addModal({
      type: ModalType.Approve,
      props: {
        spender: config.vault,
        spenderName: 'join pool',
        tokenAddress: tokensToApprove[0].address,
        tokenSymbol: tokensToApprove[0].symbol,
        tokenDecimals: tokensToApprove[0].decimals,
        titleSuffix,
        buttonLabel: tokensToApprove[1]
          ? `Go to ${tokensToApprove[1].symbol} approval`
          : 'Join pool',
        toastLabel: 'join pool',
        completeMessage: tokensToApprove[1] ? undefined : completeMessage,
        nextAction: tokensToApprove[1]
          ? {
              type: ModalType.Approve,
              props: {
                spender: config.vault,
                spenderName: 'join pool',
                buttonLabel: 'Join pool',
                toastLabel: 'join pool',
                tokenDecimals: tokensToApprove[1].decimals,
                tokenAddress: tokensToApprove[1].address,
                tokenSymbol: tokensToApprove[1].symbol,
                titleSuffix,
                completeMessage,
                nextAction: joinModalConfig,
              },
            }
          : joinModalConfig,
      },
    })
  }

  return openJoin
}
