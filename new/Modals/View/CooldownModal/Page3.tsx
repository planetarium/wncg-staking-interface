import { memo } from 'react'
import type { StateValue } from 'xstate'
import { AnimatePresence } from 'framer-motion'

import { ModalCategory } from 'states/ui'
import { useModal } from 'hooks'

import { ModalCompletePage } from 'new/Modals/shared'
import Button from 'new/Button'

type CooldownModalPage3Props = {
  currentPage: number
  currentState: StateValue
}

function CooldownModalPage3({
  currentPage,
  currentState,
}: CooldownModalPage3Props) {
  const { removeModal } = useModal()

  // FIXME: Handle failed tx
  const success = currentState === 'cooldownSuccess'
  const fail = currentState === 'cooldownFail'

  function close() {
    removeModal(ModalCategory.Cooldown)
  }

  return (
    <AnimatePresence>
      {currentPage === 3 && (
        <ModalCompletePage>
          <header className="modalHeader">
            <h2 className="title">Cooldown Started</h2>
          </header>

          <dl>
            <dt>Withdrawal period</dt>
            <dd>
              <strong>
                <time>1234</time>
              </strong>
            </dd>
          </dl>

          <div className="buttonGroup">
            <Button onClick={close} $size="lg">
              Go to main
            </Button>
          </div>
        </ModalCompletePage>
      )}
    </AnimatePresence>
  )
}

export default memo(CooldownModalPage3)
