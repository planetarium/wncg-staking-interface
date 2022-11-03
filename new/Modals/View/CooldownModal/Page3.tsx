import { memo } from 'react'
import type { StateValue } from 'xstate'
import { useAtomValue } from 'jotai'
import { AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'

import { ModalCategory } from 'states/ui'
import { timestampsAtom } from 'states/user'
import { useModal } from 'hooks'

import { ModalCompletePage } from 'new/Modals/shared'
import Button from 'new/Button'

type CooldownModalPage3Props = {
  currentPage: number
  currentState: StateValue
  disabled: boolean
}

function CooldownModalPage3({
  currentPage,
  currentState,
  disabled,
}: CooldownModalPage3Props) {
  const { removeModal } = useModal()
  const [cooldownEndsAt, withdrawEndsAt] = useAtomValue(timestampsAtom)

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
                <time>{format(cooldownEndsAt!, 'MMM d, yyyy HH:mm')}</time>
              </strong>
              ~
              <strong>
                <time>{format(withdrawEndsAt!, 'MMM d, yyyy HH:mm')}</time>
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
