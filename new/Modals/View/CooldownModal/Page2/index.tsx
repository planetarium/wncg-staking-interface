import { memo } from 'react'
import type { StateValue } from 'xstate'
import { AnimatePresence } from 'framer-motion'

import TxButton from 'new/TxButton'

type CooldownModalPage2Props = {
  currentPage: number
  currentState: StateValue
  send(value: string): void
}

function CooldownModalPage2({
  currentPage,
  currentState,
  send,
}: CooldownModalPage2Props) {
  async function goNext() {
    send('NEXT')
  }

  return (
    <AnimatePresence>
      {currentPage === 2 && (
        <div>
          <h2>page 2</h2>
          <TxButton onClick={goNext}>Start Cooldown</TxButton>
        </div>
      )}
    </AnimatePresence>
  )
}

export default memo(CooldownModalPage2)
