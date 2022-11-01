import { motion } from 'framer-motion'

import type { ModalCategory } from 'states/ui'
import { fadeIn } from 'constants/motionVariants'
import { capitalize } from 'utils/string'

import { StyledModalApprovePage } from './styled'
import { CloseButton, PendingNotice } from 'new/Modals/shared'
import TxButton from 'new/TxButton'

type ApprovePageProps = {
  action: string
  buttonLabel: string
  category: ModalCategory
  onClick(): Promise<void>
  symbol: string
  hash?: string
  isPending?: boolean
}

function ApprovePage({
  action,
  buttonLabel,
  category,
  onClick,
  symbol,
  hash,
  isPending,
}: ApprovePageProps) {
  return (
    <StyledModalApprovePage
      as={motion.div}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeIn}
    >
      <header className="modalHeader">
        <div className="titleGroup">
          <h2 className="title accent">
            {symbol} Approval for {capitalize(action)}
          </h2>
          <h3 className="subtitle">
            First, Please approve your wallet to have smart contract for{' '}
            {action}
          </h3>
        </div>
        <p className="desc">You only have to do it once this time.</p>

        <CloseButton modal={category} />
      </header>

      <TxButton onClick={onClick} isPending={isPending} $size="lg">
        {buttonLabel}
      </TxButton>

      <PendingNotice hash={hash} />
    </StyledModalApprovePage>
  )
}

export default ApprovePage
