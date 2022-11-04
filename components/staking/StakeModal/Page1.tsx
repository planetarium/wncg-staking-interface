import { memo } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { AnimatePresence } from 'framer-motion'

import { pendingStakeTxAtom } from 'states/form'
import { stakingContractAddressAtom } from 'states/staking'
import { ModalCategory } from 'states/ui'
import { useApprove, useStaking } from 'hooks'

import ApprovePage from 'components/Modals/shared/ApprovePage'

type StakeModalPage1Props = {
  currentPage: number
  send(value: string): void
  isPending?: boolean
}

function StakeModalPage1({
  currentPage,
  send,
  isPending,
}: StakeModalPage1Props) {
  const [pendingTx, setPendingTx] = useAtom(pendingStakeTxAtom)

  const { stakedTokenAddress } = useStaking()
  const stakingAddress = useAtomValue(stakingContractAddressAtom)

  const approve = useApprove(stakedTokenAddress, stakingAddress, {
    onConfirm(txHash?: Hash) {
      setPendingTx({
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
          action="staking"
          buttonLabel="Approve and Go staking"
          category={ModalCategory.Stake}
          onClick={approve}
          symbol="LP Token"
          hash={pendingTx.hash}
          isPending={isPending}
        />
      )}
    </AnimatePresence>
  )
}

export default memo(StakeModalPage1)
