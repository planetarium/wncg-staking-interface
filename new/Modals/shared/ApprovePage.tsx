import type { ModalCategory } from 'states/ui'

import { capitalize } from 'utils/string'

import { CloseButton, ModalPage, PendingNotice } from 'new/Modals/shared'
import TxButton from 'new/TxButton'

type ApprovePageProps = {
  action: string
  buttonLabel: string
  category: ModalCategory
  onClick(): Promise<void>
  symbol: string
  className?: string
  hash?: string
  isPending?: boolean
}

function ApprovePage({
  action,
  buttonLabel,
  category,
  onClick,
  symbol,
  className,
  hash,
  isPending,
}: ApprovePageProps) {
  return (
    <ModalPage className={className}>
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

      <TxButton onClick={onClick} isPending={isPending}>
        {buttonLabel}
      </TxButton>

      <PendingNotice hash={hash} />
    </ModalPage>
  )
}

export default ApprovePage
