import { memo } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { AnimatePresence, motion } from 'framer-motion'

import {
  pendingJoinAmountsAtom,
  pendingJoinAssetsAtom,
  pendingJoinHashAtom,
} from 'states/form'
import { ModalCategory } from 'states/ui'
import { fadeIn } from 'constants/motionVariants'
import { renderStrong } from 'utils/numberFormat'
import { getTokenSymbol } from 'utils/token'
import { useJoin } from './useJoin'

import { StyledJoinModalPage3 } from './styled'
import ModalClose from 'new/Modals/shared/ModalClose'
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
  const [hash, setHash] = useAtom(pendingJoinHashAtom)
  const setJoinAmounts = useSetAtom(pendingJoinAmountsAtom)
  const setJoinAssets = useSetAtom(pendingJoinAssetsAtom)

  const joinPool = useJoin(amounts, assets, {
    onConfirm(txHash?: Hash) {
      setHash(txHash)
      setJoinAmounts(amounts)
      setJoinAssets(assets)
      console.log('✨ CALL from:', 3, amounts)
      send('CALL')
    },
    onError(error: any) {
      if (error?.code === 'ACTION_REJECTED') return
      console.log('🔥 FAIL from:', 3)
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
          <header className="header">
            <div className="titleGroup">
              <h2 className="title">Join pool</h2>
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

            <ModalClose modal={ModalCategory.Join} />
          </header>

          <TxButton onClick={joinPool} isPending={isPending} $size="lg">
            Join pool
          </TxButton>

          <PendingNotice hash={hash} />
        </StyledJoinModalPage3>
      )}
    </AnimatePresence>
  )
}

export default memo(JoinModalPage1)
