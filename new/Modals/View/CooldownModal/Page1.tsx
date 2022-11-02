import { memo } from 'react'
import type { StateValue } from 'xstate'
import { AnimatePresence } from 'framer-motion'

import { ModalCategory } from 'states/ui'

import { CloseButton, ModalPage } from 'new/Modals/shared'
import Button from 'new/Button'

type CooldownModalPage1Props = {
  currentPage: number
  currentState: StateValue
  send(value: string): void
}

function CooldownModalPage1({
  currentPage,
  currentState,
  send,
}: CooldownModalPage1Props) {
  function goNext() {
    send('NEXT')
  }

  return (
    <AnimatePresence>
      {currentPage === 1 && (
        <ModalPage>
          <header className="modalHeader">
            <div className="titleGroup">
              <h2 className="title accent">Estimated Earn</h2>
              <h3 className="subtitle">
                In a few days, you&apos;ll get more profit.
                <br />
                Do you really start cooldown?
              </h3>
            </div>

            <CloseButton modal={ModalCategory.Cooldown} />
          </header>
          <Button onClick={goNext} $size="lg">
            Yes, I don&apos;t care
          </Button>
        </ModalPage>
      )}
    </AnimatePresence>
  )
}

export default memo(CooldownModalPage1)
