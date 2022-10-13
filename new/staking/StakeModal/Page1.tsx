import { memo } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { AnimatePresence } from 'framer-motion'

import { pendingStakeHashAtom } from 'states/form'
import { stakingContractAddressAtom } from 'states/staking'
import { ModalCategory } from 'states/ui'
import { useApprove } from 'hooks'
import { useStaking } from 'hooks/contracts'

import ApprovePage from 'new/Modals/shared/ApprovePage'

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
  const [hash, setHash] = useAtom(pendingStakeHashAtom)

  const { stakedTokenAddress } = useStaking()
  const stakingAddress = useAtomValue(stakingContractAddressAtom)

  const approve = useApprove(stakedTokenAddress, stakingAddress, {
    onConfirm(txHash?: Hash) {
      setHash(txHash)
      send('CALL')
    },
    onError(error: any) {
      if (error?.code === 'ACTION_REJECTED') return
      send('FAIL')
    },
  })

  return (
    <AnimatePresence>
      {currentPage === 1 && (
        <ApprovePage
          action="staking"
          category={ModalCategory.Stake}
          onClick={approve}
          symbol="LP Token"
          hash={hash}
          isPending={isPending}
        />
      )}
    </AnimatePresence>
  )
}

export default memo(StakeModalPage1)
