import { memo } from 'react'
import { useAtom } from 'jotai'
import { AnimatePresence } from 'framer-motion'

import { pendingJoinTxAtom } from 'states/form'
import { ModalCategory } from 'states/ui'
import { configService } from 'services/config'
import { getTokenSymbol } from 'utils/token'
import { useApprove } from 'hooks'

import ApprovePage from 'new/Modals/shared/ApprovePage'

type JoinModalPage1Props = {
  address: string
  currentPage: number
  send(value: string): void
  tokensToApprove: string[]
  isPending?: boolean
}

function JoinModalPage1({
  address,
  currentPage,
  send,
  tokensToApprove,
  isPending,
}: JoinModalPage1Props) {
  const [pendingJoinTx, setPendingJoinTx] = useAtom(pendingJoinTxAtom)
  const symbol = getTokenSymbol(address)

  const approve = useApprove(address, configService.vaultAddress, {
    onConfirm(txHash?: Hash) {
      setPendingJoinTx({
        amounts: undefined,
        assets: undefined,
        approving: address,
        tokensToApprove,
        hash: txHash,
      })

      send('CALL')
    },
    onError(error) {
      if (error?.code === 'ACTION_REJECTED') return
      if (error?.code === 4001) return
      send('FAIL')
    },
  })

  return (
    <AnimatePresence>
      {currentPage === 1 && (
        <ApprovePage
          action="joining pool"
          buttonLabel={`Approve ${symbol}`}
          category={ModalCategory.Join}
          onClick={approve}
          symbol={getTokenSymbol(address)}
          hash={pendingJoinTx.hash}
          isPending={isPending}
        />
      )}
    </AnimatePresence>
  )
}

export default memo(JoinModalPage1)
