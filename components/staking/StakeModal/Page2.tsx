import { memo } from 'react'
import { AnimatePresence } from 'framer-motion'

import { ModalCompletePage } from 'components/Modals/shared'
import Button from 'components/Button'

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
        <ModalCompletePage>
          <header className="modalHeader">
            <h2 className="title">Approval completed!</h2>
          </header>
          <Button onClick={goNext} $size="lg">
            Go to staking
          </Button>
        </ModalCompletePage>
      )}
    </AnimatePresence>
  )
}

export default memo(StakeModalPage2)
