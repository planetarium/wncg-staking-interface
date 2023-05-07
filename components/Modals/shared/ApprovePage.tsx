import { CloseButton, ModalPage, PendingNotice } from 'components/Modals/shared'
import TxButton from 'components/TxButton'

type ApprovePageProps = {
  action: string
  buttonLabel: string
  onClick(): Promise<void>
  symbol: string
  className?: string
  hash?: Hash
  isPending?: boolean
}

function ApprovePage({
  action,
  buttonLabel,
  onClick,
  symbol,
  className,
  hash,
}: ApprovePageProps) {
  return (
    <ModalPage className={className}>
      <header className="modalHeader">
        <div className="titleGroup">
          <h2 className="title accent">
            {symbol} approval for {action}
          </h2>
          <h3 className="subtitle">
            First, Please approve your wallet to have smart contract for{' '}
            {action}
          </h3>
        </div>
        <p className="desc">You only have to do it once this time.</p>

        <CloseButton />
      </header>

      <TxButton onClick={onClick} hash={hash}>
        {buttonLabel}
      </TxButton>

      <PendingNotice hash={hash} />
    </ModalPage>
  )
}

export default ApprovePage
