import { memo } from 'react'
import type { StateValue } from 'xstate'
import { AnimatePresence, motion } from 'framer-motion'

import { ModalCategory } from 'states/ui'
import { fadeIn } from 'constants/motionVariants'
import { useModal } from 'hooks'

import { StyledJoinModalPage4 } from './styled'
import Button from 'new/Button'

type JoinModalPage2Props = {
  currentPage: number
  currentState: StateValue
  send(value: string): void
}

function JoinModalPage2({
  currentPage,
  currentState,
  send,
}: JoinModalPage2Props) {
  const { removeModal } = useModal()

  const success = currentState === 'stakeSuccess'
  const fail = currentState === 'stakeFail'

  function close() {
    removeModal(ModalCategory.Stake)
  }

  return (
    <AnimatePresence>
      {currentPage === 4 && (
        <StyledJoinModalPage4
          as={motion.div}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeIn}
        >
          <header className="header">
            <h2 className="title">Join pool completed!</h2>
          </header>
          <Button onClick={close} $size="lg">
            Go to staking
          </Button>
          <Button onClick={close} $variant="tertiary" $size="lg">
            Close
          </Button>
        </StyledJoinModalPage4>
      )}
    </AnimatePresence>
  )
}

export default memo(JoinModalPage2)
