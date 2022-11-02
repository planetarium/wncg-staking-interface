import { memo } from 'react'
import { useAtom } from 'jotai'
import { AnimatePresence } from 'framer-motion'

import { pendingStakeTxAtom } from 'states/form'
import { ModalCategory } from 'states/ui'
import { useStake } from './useStake'

import { StyledStakeModalPage3 } from './styled'
import { CloseButton, PendingNotice } from 'new/Modals/shared'
import NumberFormat from 'new/NumberFormat'
import TxButton from 'new/TxButton'

type StakeModalPage3Props = {
  amount: string
  currentPage: number
  fiatValue: number
  send(value: string): void
  isPending?: boolean
}

function StakeModalPage3({
  amount,
  currentPage,
  fiatValue,
  send,
  isPending,
}: StakeModalPage3Props) {
  const [pendingTx, setPendingTx] = useAtom(pendingStakeTxAtom)

  const stake = useStake(amount, {
    onConfirm(txHash?: Hash) {
      setPendingTx({
        amount,
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
      {currentPage === 3 && (
        <StyledStakeModalPage3>
          <header className="modalHeader">
            <div className="titleGroup">
              <h2 className="title accent">Staking</h2>
              <h3 className="subtitle">
                Do you want to stake?
                <strong className="amount">
                  <NumberFormat value={amount} suffix="LP" />
                  <NumberFormat
                    className="usdValue"
                    value={fiatValue}
                    decimals={2}
                    prefix="($"
                    suffix=")"
                  />
                </strong>
              </h3>
            </div>

            <p className="desc">
              You have to go through the cooldown period when you draw with it
              later.
            </p>

            <CloseButton modal={ModalCategory.Stake} />
          </header>

          <TxButton onClick={stake} isPending={isPending} $size="lg">
            Stake
          </TxButton>

          <PendingNotice hash={pendingTx.hash} />
        </StyledStakeModalPage3>
      )}
    </AnimatePresence>
  )
}

export default memo(StakeModalPage3)
