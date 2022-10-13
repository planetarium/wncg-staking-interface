import { useMemo, useState } from 'react'
import { configService } from 'services/config'
import { assertUnreachable } from 'utils/assertion'

import Page1 from './Page1'
import Page2 from './Page2'

type ApproveModalProps = {
  spender: string
  symbol: string
  tokenAddress: string
}

function ApproveModal({ spender, symbol, tokenAddress }: ApproveModalProps) {
  const [page, setPage] = useState(1)
  const action = useMemo(() => getAction(spender), [spender])

  return (
    <div>
      {page === 1 && (
        <Page1
          action={action}
          spender={spender}
          symbol={symbol}
          tokenAddress={tokenAddress}
        />
      )}

      {page === 2 && <Page2 symbol={symbol} tokenAddress={tokenAddress} />}
    </div>
  )
}

export default ApproveModal

function getAction(spender: string) {
  switch (true) {
    case spender === configService.vaultAddress:
      return 'Join pool'
    case configService.stakingContractAddresses.includes(spender):
      return 'Staking'
    default:
      assertUnreachable(spender)
  }
}
