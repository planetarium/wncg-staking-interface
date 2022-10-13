import { useState } from 'react'

import type { ModalCategory } from 'states/ui'
import { useApprove } from 'hooks'

import { StyledApproveModalPage1 } from './styled'
import TxButton from 'new/TxButton'
import ModalClose from 'new/Modals/shared/ModalClose'
import PendingNotice from 'new/Modals/shared/PendingNotice'

type ApproveModalPage1Props = {
  action: string
  category: ModalCategory
  spender: string
  symbol: string
  tokenAddress: string
}

function ApproveModalPage1({
  action,
  category,
  spender,
  symbol,
  tokenAddress,
}: ApproveModalPage1Props) {
  const [hash, setHash] = useState<string | undefined>()

  const { approve } = useApprove(tokenAddress, spender, {
    onSuccess(newHash?: string) {
      setHash(newHash)
    },
  })

  return (
    <StyledApproveModalPage1>
      <header className="header">
        <div className="titleGroup">
          <h2 className="title">
            {symbol} Approval for {action}
          </h2>
          <h3 className="subtitle">
            First, Please approve your wallet to have smart contract for{' '}
            {action}
          </h3>
        </div>
        <p className="desc">You only have to do it once this time.</p>

        <ModalClose modal={category} />
      </header>

      <TxButton onClick={approve} $size="lg">
        Approve & Go {action}
      </TxButton>

      <PendingNotice hash={hash} />
    </StyledApproveModalPage1>
  )
}

export default ApproveModalPage1
