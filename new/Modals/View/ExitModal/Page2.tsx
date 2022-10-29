import { useAtom } from 'jotai'
import { AnimatePresence, motion } from 'framer-motion'

import { pendingExitTxAtom } from 'states/form'
import { ModalCategory } from 'states/ui'
import { fadeIn } from 'constants/motionVariants'
import { configService } from 'services/config'
import { bnum } from 'utils/num'
import { renderStrong } from 'utils/numberFormat'
import { getTokenSymbol } from 'utils/token'
import { usePool } from 'hooks'
import { useExit } from './useExit'

import { StyledExitModalPage2 } from './styled'
import CloseButton from 'new/Modals/shared/CloseButton'
import PendingNotice from 'new/Modals/shared/PendingNotice'
import NumberFormat from 'new/NumberFormat'
import TxButton from 'new/TxButton'

type ExitModalPage2Props = {
  assets: string[]
  bptIn: string
  currentPage: number
  exitAmounts: string[]
  exitType: string
  exactOut: boolean
  fiatValue: string
  isProportional: boolean
  send(value: string): void
  isPending?: boolean
}

function ExitModalPage2({
  assets,
  bptIn,
  currentPage,
  exitAmounts,
  exitType,
  exactOut,
  fiatValue,
  isProportional,
  send,
  isPending,
}: ExitModalPage2Props) {
  const { nativeAssetIndex, poolTokenAddresses } = usePool()

  const [pendingTx, setPendingTx] = useAtom(pendingExitTxAtom)

  const exitPool = useExit(
    exitAmounts,
    assets,
    bptIn,
    exactOut,
    isProportional,
    {
      onConfirm(txHash?: Hash) {
        setPendingTx({
          amounts: exitAmounts,
          assets,
          bptIn,
          exactOut,
          exitType,
          isProportional,
          hash: txHash,
        })
        send('CALL')
      },
      onError(error) {
        if (error?.code === 'ACTION_REJECTED') return
        if (error?.code === 4001) return
        send('FAIL')
      },
    }
  )

  return (
    <AnimatePresence>
      {currentPage === 2 && (
        <StyledExitModalPage2
          as={motion.div}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeIn}
        >
          <header className="modalHeader">
            <div className="titleGroup">
              <h2 className="title accent">Exit pool</h2>
              <h3 className="subtitle">
                Do you want to Exit pool?
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
              {exitAmounts.map((amount, i) => {
                if (bnum(amount).isZero()) return null
                const address =
                  exitType === configService.nativeAssetAddress &&
                  i === nativeAssetIndex
                    ? configService.nativeAssetAddress
                    : poolTokenAddresses[i]

                return (
                  <NumberFormat
                    key={`exitAmounts:${exitType}:${amount}`}
                    value={amount}
                    suffix={` ${getTokenSymbol(address)}`}
                  />
                )
              })}
            </p>

            <CloseButton modal={ModalCategory.Exit} />
          </header>

          <TxButton onClick={exitPool} isPending={isPending} $size="lg">
            Exit pool
          </TxButton>

          <PendingNotice hash={pendingTx.hash} />
        </StyledExitModalPage2>
      )}
    </AnimatePresence>
  )
}

export default ExitModalPage2
