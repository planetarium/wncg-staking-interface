import { memo } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { AnimatePresence, motion } from 'framer-motion'

import { pendingStakeAmountAtom, pendingStakeHashAtom } from 'states/form'
import { ModalCategory } from 'states/ui'
import { fadeIn } from 'constants/motionVariants'
import { useStake } from './useStake'

import { StyledStakeModalPage3 } from './styled'
import ModalClose from 'new/Modals/shared/ModalClose'
import PendingNotice from 'new/Modals/shared/PendingNotice'
import NumberFormat from 'new/NumberFormat'
import TxButton from 'new/TxButton'

type StakeModalPage3Props = {
  amount: string
  currentPage: number
  fiatValue: number
  send(value: string): void
  isPending?: boolean
}

function StakeModalPage3({
  amount,
  currentPage,
  fiatValue,
  send,
  isPending,
}: StakeModalPage3Props) {
  const [hash, setHash] = useAtom(pendingStakeHashAtom)
  const setStakeAmount = useSetAtom(pendingStakeAmountAtom)

  const stake = useStake(amount, {
    onConfirm(txHash?: Hash) {
      setHash(txHash)
      setStakeAmount(amount)
      send('CALL')
    },
    onError(error: any) {
      if (error?.code === 'ACTION_REJECTED') return
      send('FAIL')
    },
  })

  return (
    <AnimatePresence>
      {currentPage === 3 && (
        <StyledStakeModalPage3
          as={motion.div}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeIn}
        >
          <header className="modalHeader">
            <div className="titleGroup">
              <h2 className="title">Staking</h2>
              <h3 className="subtitle">
                Do you want to stake?
                <strong className="amount">
                  <NumberFormat value={amount} suffix="LP" />
                  <NumberFormat
                    className="usdValue"
                    value={fiatValue}
                    decimals={2}
                    prefix="($"
                    suffix=")"
                  />
                </strong>
              </h3>
            </div>

            <p className="desc">
              You have to go through the cooldown period when you draw with it
              later.
            </p>

            <ModalClose modal={ModalCategory.Stake} />
          </header>

          <TxButton onClick={stake} isPending={isPending} $size="lg">
            Stake
          </TxButton>

          <PendingNotice hash={hash} />
        </StyledStakeModalPage3>
      )}
    </AnimatePresence>
  )
}

export default memo(StakeModalPage3)
