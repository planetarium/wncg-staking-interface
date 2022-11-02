import { memo } from 'react'
import { useAtomValue } from 'jotai'
import { AnimatePresence, motion } from 'framer-motion'

import { pendingJoinTxAtom } from 'states/form'
import { fadeIn } from 'constants/motionVariants'
import { getTokenSymbol } from 'utils/token'

import { StyledModalCompletePage } from 'new/Modals/shared/styled'
import Button from 'new/Button'

type JoinModalPage2Props = {
  address: string
  approvals: string[]
  currentPage: number
  send(value: string): void
}

function JoinModalPage2({
  address,
  approvals,
  currentPage,
  send,
}: JoinModalPage2Props) {
  const { approving } = useAtomValue(pendingJoinTxAtom)

  function goNext() {
    send('NEXT')
  }

  const label =
    approvals.length > 0
      ? `Go to approve ${getTokenSymbol(address)}`
      : `Go to join pool`

  return (
    <AnimatePresence>
      {currentPage === 2 && (
        <StyledModalCompletePage
          as={motion.div}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeIn}
        >
          <header className="modalHeader">
            <h2 className="title">
              {getTokenSymbol(approving || '')} Approval Completed!
            </h2>
          </header>

          <div className="buttonGroup">
            <Button onClick={goNext} $size="lg">
              {label}
            </Button>
          </div>
        </StyledModalCompletePage>
      )}
    </AnimatePresence>
  )
}

export default memo(JoinModalPage2)
