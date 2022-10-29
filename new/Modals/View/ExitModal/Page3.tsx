import { memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { ModalCategory } from 'states/ui'
import { fadeIn } from 'constants/motionVariants'
import { useModal } from 'hooks'

import { StyledExitModalPage3 } from './styled'
import Button from 'new/Button'

type ExitModalPage3Props = {
  currentPage: number
  // send(value: string): void
}

function ExitModalPage3({ currentPage }: ExitModalPage3Props) {
  const { removeModal } = useModal()

  // const success = currentState === 'stakeSuccess'
  // const fail = currentState === 'stakeFail'

  function close() {
    removeModal(ModalCategory.Exit)
  }

  return (
    <AnimatePresence>
      {currentPage === 3 && (
        <StyledExitModalPage3
          as={motion.div}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeIn}
        >
          <header className="modalHeader">
            <h2 className="title">Exit pool completed!</h2>
          </header>

          <div className="buttonGroup">
            <Button onClick={close} $size="lg">
              Go to main
            </Button>
            <Button onClick={close} $variant="tertiary" $size="lg">
              Close
            </Button>
          </div>
        </StyledExitModalPage3>
      )}
    </AnimatePresence>
  )
}

export default memo(ExitModalPage3)
