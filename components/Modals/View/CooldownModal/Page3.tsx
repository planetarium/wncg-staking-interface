import { memo } from 'react'
import type { StateValue } from 'xstate'
import { useAtomValue } from 'jotai'
import { AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'

import { ModalCategory } from 'states/ui'
import { roundedTimestampsAtom } from 'states/user'
import { datePattern } from 'constants/time'
import { useModal } from 'hooks'

import { StyledCooldownModalPage3 } from './styled'
import Button from 'components/Button'

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
  const [cooldownEndsAt, withdrawEndsAt] = useAtomValue(roundedTimestampsAtom)

  // FIXME: Handle failed tx
  // const success = currentState === 'cooldownSuccess'
  // const fail = currentState === 'cooldownFail'

  function close() {
    removeModal(ModalCategory.Cooldown)
  }

  return (
    <AnimatePresence>
      {currentPage === 3 && (
        <StyledCooldownModalPage3>
          <header className="modalHeader">
            <h2 className="title">Cooldown Started</h2>
          </header>

          <dl className="detail">
            <dt>Withdrawal period</dt>
            <dd>
              <strong>
                <time dateTime={cooldownEndsAt.toString()}>
                  {format(cooldownEndsAt, datePattern)}
                </time>
              </strong>
              <strong className="tilde">
                <time dateTime={withdrawEndsAt.toString()}>
                  {format(withdrawEndsAt, datePattern)}
                </time>
              </strong>
            </dd>
          </dl>

          <div className="buttonGroup">
            <Button onClick={close} $size="lg">
              Go to main
            </Button>
          </div>
        </StyledCooldownModalPage3>
      )}
    </AnimatePresence>
  )
}

export default memo(CooldownModalPage3)
