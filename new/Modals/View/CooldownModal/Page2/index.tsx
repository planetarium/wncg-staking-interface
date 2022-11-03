import { memo } from 'react'
import type { StateValue } from 'xstate'
import { useAtom } from 'jotai'
import { AnimatePresence } from 'framer-motion'

import { pendingCooldownTxAtom } from 'states/form'
import { ModalCategory } from 'states/ui'
import { useCooldown } from '../useCooldown'

import { StyledCooldownModalPage2 } from './styled'
import { CloseButton, PendingNotice } from 'new/Modals/shared'
import TxButton from 'new/TxButton'

type CooldownModalPage2Props = {
  currentPage: number
  currentState: StateValue
  disabled: boolean
  send(value: string): void
}

function CooldownModalPage2({
  currentPage,
  currentState,
  disabled,
  send,
}: CooldownModalPage2Props) {
  const [pendingTx, setPendingTx] = useAtom(pendingCooldownTxAtom)

  const cooldown = useCooldown({
    onConfirm(txHash?: Hash) {
      setPendingTx({
        hash: txHash,
      })
      send('CALL')
    },
    onError(error) {
      if (error?.code === 'ACTION_REJECTED') return
      if (error?.code === 4001) return
      send('FAIL')
    },
  })

  return (
    <AnimatePresence>
      {currentPage === 2 && (
        <StyledCooldownModalPage2>
          <header className="modalHeader">
            <div className="titleGroup">
              <h2 className="title accent">Cooldown</h2>
              <h3 className="subtitle">
                You can only withdraw for 3 days after the Cooldown Period (14
                days) has passed.
              </h3>
            </div>
            <CloseButton modal={ModalCategory.Cooldown} />
          </header>

          <TxButton
            onClick={cooldown}
            isPending={currentState === 'cooldownPending'}
          >
            Start Cooldown
          </TxButton>

          <PendingNotice hash={pendingTx.hash} />
        </StyledCooldownModalPage2>
      )}
    </AnimatePresence>
  )
}

export default memo(CooldownModalPage2)
