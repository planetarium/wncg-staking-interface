import { memo } from 'react'

import { explorerUrlFor } from 'utils/explorerUrlFor'
import { useAuth, useConnect, useStaking } from 'hooks'

import { StyledPoolHeader } from './styled'
import Icon from 'components/Icon'
import TokenIcon from 'components/TokenIcon'
import Button from 'components/Button'

function PoolHeader() {
  const { isConnected } = useAuth()
  const { openConnectModal } = useConnect()

  const {
    bptName,
    poolTokenAddresses,
    poolTokenSymbols,
    poolTokenWeightsInPcnt,
  } = useStaking()

  return (
    <StyledPoolHeader className="poolHeader">
      <strong className="poolName">{bptName}</strong>
      <div className="titleGroup">
        <h2 className="title">Join pool, Get LP Tokens!</h2>

        <div className="tokenList">
          {poolTokenAddresses?.map((addr, i) => (
            <a
              className="tokenItem"
              key={`poolHeader:${addr}`}
              href={explorerUrlFor(addr)}
              target="_blank"
              rel="noopener"
              aria-label="Open in Etherscan"
            >
              <TokenIcon address={addr as Hash} $size={20} />
              <strong className="symbol">{poolTokenSymbols[i]}</strong>

              <span className="weight">{poolTokenWeightsInPcnt[i]}%</span>
              <Icon icon="outlink" />
            </a>
          ))}
        </div>
      </div>

      {!isConnected && (
        <Button className="connectButton" $size="lg" onClick={openConnectModal}>
          Connect wallet
        </Button>
      )}
    </StyledPoolHeader>
  )
}

export default memo(PoolHeader)
