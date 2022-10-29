import { memo } from 'react'
import { useAtom } from 'jotai'
import { AnimatePresence, motion } from 'framer-motion'

import { pendingJoinTxAtom } from 'states/form'
import { ModalCategory } from 'states/ui'
import { fadeIn } from 'constants/motionVariants'
import { renderStrong } from 'utils/numberFormat'
import { getTokenSymbol } from 'utils/token'
import { useJoin } from './useJoin'

import { StyledJoinModalPage3 } from './styled'
import CloseButton from 'new/Modals/shared/CloseButton'
import PendingNotice from 'new/Modals/shared/PendingNotice'
import NumberFormat from 'new/NumberFormat'
import TxButton from 'new/TxButton'

type JoinModalPage1Props = {
  amounts: string[]
  assets: string[]
  currentPage: number
  fiatValue: number
  send(value: string): void
  isPending?: boolean
}

function JoinModalPage1({
  amounts,
  assets,
  currentPage,
  fiatValue,
  send,
  isPending,
}: JoinModalPage1Props) {
  const [pendingTx, setPendingTx] = useAtom(pendingJoinTxAtom)

  const joinPool = useJoin(amounts, assets, {
    onConfirm(txHash?: Hash) {
      setPendingTx({
        amounts,
        assets,
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
        <StyledJoinModalPage3
          as={motion.div}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeIn}
        >
          <header className="modalHeader">
            <div className="titleGroup">
              <h2 className="title accent">Join pool</h2>
              <h3 className="subtitle">
                Do you want to Join pool?
                <strong className="amounts">
                  <NumberFormat
                    value={fiatValue}
                    decimals={2}
                    prefix="$"
                    renderText={renderStrong}
                  />
                </strong>
              </h3>
            </div>

            <p className="desc accent">
              {amounts.map((amount, i) => (
                <NumberFormat
                  key={`joinAmounts:${assets[i]}:${amount}`}
                  value={amount}
                  suffix={` ${getTokenSymbol(assets[i])}`}
                />
              ))}
            </p>

            <CloseButton modal={ModalCategory.Join} />
          </header>

          <TxButton onClick={joinPool} isPending={isPending} $size="lg">
            Join pool
          </TxButton>

          <PendingNotice hash={pendingTx.hash} />
        </StyledJoinModalPage3>
      )}
    </AnimatePresence>
  )
}

export default memo(JoinModalPage1)
