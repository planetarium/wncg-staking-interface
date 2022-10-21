import { memo } from 'react'
import { useAtom } from 'jotai'
import { AnimatePresence } from 'framer-motion'

import { pendingJoinHashAtom } from 'states/form'
import { ModalCategory } from 'states/ui'
import { useApprove } from 'hooks'

import ApprovePage from 'new/Modals/shared/ApprovePage'
import { configService } from 'services/config'
import { getTokenSymbol } from 'utils/token'

type JoinModalPage1Props = {
  address: string
  currentPage: number
  send(value: string): void
  isPending?: boolean
}

function JoinModalPage1({
  address,
  currentPage,
  send,
  isPending,
}: JoinModalPage1Props) {
  const [hash, setHash] = useAtom(pendingJoinHashAtom)
  const symbol = getTokenSymbol(address)

  const approve = useApprove(address, configService.vaultAddress, {
    onConfirm(txHash?: Hash) {
      setHash(txHash)
      console.log('✨ CALL from:', 1)
      send('CALL')
    },
    onError(error: any) {
      if (error?.code === 'ACTION_REJECTED') return
      console.log('🔥 FAIL from:', 1)
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
          hash={hash}
          isPending={isPending}
        />
      )}
    </AnimatePresence>
  )
}

export default memo(JoinModalPage1)
