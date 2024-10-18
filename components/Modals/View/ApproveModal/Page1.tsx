import { useChain, useStaking } from 'hooks'

import ConnectorIcon from 'components/ConnectorIcon'
import { CloseButton, PendingNotice } from 'components/Modals/shared'
import TxButton from 'components/TxButton'
import { ConnectorId } from 'config/constants'
import { wallets } from 'lib/rainbowkit/wallets'
import { useMemo } from 'react'
import { isBsc } from 'utils/isBsc'
import { StyledApproveModalPage1 } from './styled'

type ApproveModalPage1Props = {
  address: Hash
  approve(): Promise<void>
  toastLabel: string
  spenderName: string
  symbol: string
  className?: string
  hash?: Hash
}

function ApproveModalPage1({
  address,
  spenderName,
  symbol,
  toastLabel,
  className,
  hash,
  approve,
}: ApproveModalPage1Props) {
  const { chainId } = useChain()
  const { lpToken, tokens } = useStaking()
  const token = tokens?.[address] ?? {}

  const labelSymbol = useMemo(() => {
    if (isBsc(chainId) && address === lpToken?.address)
      return token?.name ?? symbol
    return token?.symbol ?? symbol
  }, [address, chainId, lpToken?.address, symbol, token.name, token?.symbol])

  return (
    <StyledApproveModalPage1 className={className}>
      <header className="modalHeader">
        <div className="titleGroup">
          <h2 className="title accent">
            {symbol} approval for {spenderName}
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
            <ConnectorIcon icon={ConnectorId.MetaMask} $size={20} />
            <h4 className="guideTitle">For MetaMask, follow these steps:</h4>

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
              {wallets.map(
                ({ id }) =>
                  id !== ConnectorId.MetaMask && (
                    <ConnectorIcon
                      key={`approveModal:guide:${id}`}
                      icon={id as ConnectorIconType}
                    />
                  )
              )}
            </div>

            <h4 className="guideTitle">
              For other wallets, simply confirm the transaction to approve the
              token spending
            </h4>
          </div>
        </div>
      </div>

      <footer className="modalFooter">
        <TxButton onClick={approve} hash={hash}>
          Approve {labelSymbol}
        </TxButton>
      </footer>

      <PendingNotice hash={hash} />
    </StyledApproveModalPage1>
  )
}

export default ApproveModalPage1
