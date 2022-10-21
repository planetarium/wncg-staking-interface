import { memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { fadeIn } from 'constants/motionVariants'
import { getTokenSymbol } from 'utils/token'

import { StyledModalCompletePage } from 'new/Modals/shared/styled'
import Button from 'new/Button'

type JoinModalPage2Props = {
  address: string
  approvals: boolean[]
  currentPage: number
  send(value: string): void
}

function JoinModalPage2({
  address,
  approvals,
  currentPage,
  send,
}: JoinModalPage2Props) {
  function goNext() {
    console.log('👍 NEXT from:', 2)
    send('NEXT')
  }

  const label = approvals.some((item) => !item)
    ? `Go to approve`
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
          <header className="header">
            <h2 className="title">
              {getTokenSymbol(address)} Approval completed!
            </h2>
          </header>
          <Button onClick={goNext} $size="lg">
            {label}
          </Button>
        </StyledModalCompletePage>
      )}
    </AnimatePresence>
  )
}

export default memo(JoinModalPage2)
