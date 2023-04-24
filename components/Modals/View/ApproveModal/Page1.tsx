import { capitalize } from 'utils/capitalize'
import { useAuth, useConnect } from 'hooks'

import { StyledApproveModalPage1 } from './styled'
import { CloseButton, PendingNotice } from 'components/Modals/shared'
import TxButton from 'components/TxButton'
import ConnectorIcon from 'components/ConnectorIcon'

type ApproveModalPage1Props = {
  address: Hash
  approve(): Promise<void>
  buttonLabel: string
  toastLabel: string
  spenderName: string
  symbol: string
  className?: string
  hash?: Hash
}

function ApproveModalPage1({
  spenderName,
  symbol,
  buttonLabel,
  toastLabel,
  className,
  hash,
  approve,
}: ApproveModalPage1Props) {
  const { wallets } = useConnect()
  return (
    <StyledApproveModalPage1 className={className}>
      <header className="modalHeader">
        <div className="titleGroup">
          <h2 className="title accent">
            Approval for {capitalize(spenderName)}
          </h2>
          <h3 className="subtitle">
            Please approve the token spending to {toastLabel}
          </h3>
        </div>

        <CloseButton />
      </header>

      <div className="container">
        <div className="modalContent">
          <div className="guide">
            <ConnectorIcon icon="metaMask" $size={20} />
            <h4 className="guideTitle">For Metamask, follow these steps:</h4>

            <ol>
              <li>
                Click the button below to trigger the token spending cap window.
              </li>
              <li>
                Enter the amount of LP tokens you want to stake.
                <ul>
                  <li>Click &apos;Max&apos; to use your current balance.</li>
                  <li>
                    Click &apos;Use Default&apos; to grant infinite approval.
                  </li>
                </ul>
              </li>
            </ol>
          </div>

          <div className="guide">
            <div className="walletGroup">
              {wallets.map((w) => {
                if (w.connectorId === 'metaMask') return null
                return (
                  <ConnectorIcon
                    key={`approveModal:guide:${w.connectorId}`}
                    icon={w.connectorId as ConnectorIconType}
                  />
                )
              })}
            </div>

            <h4 className="guideTitle">
              For other wallets, simply confirm the transaction to approve the
              token spending.
            </h4>
          </div>
        </div>
      </div>

      <footer className="modalFooter">
        <TxButton onClick={approve} hash={hash}>
          Approve & {buttonLabel}
        </TxButton>
      </footer>

      <PendingNotice hash={hash} />
    </StyledApproveModalPage1>
  )
}

export default ApproveModalPage1
