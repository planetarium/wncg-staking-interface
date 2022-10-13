import { memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { fadeIn } from 'constants/motionVariants'

import { StyledModalCompletePage } from 'new/Modals/shared/styled'
import Button from 'new/Button'

type StakeModalPage2Props = {
  currentPage: number
  send(value: string): void
}

function StakeModalPage2({ currentPage, send }: StakeModalPage2Props) {
  function goNext() {
    send('STAKE')
  }

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
            <h2 className="title">Approval completed!</h2>
          </header>
          <Button onClick={goNext} $size="lg">
            Go to staking
          </Button>
        </StyledModalCompletePage>
      )}
    </AnimatePresence>
  )
}

export default memo(StakeModalPage2)
