import { memo } from 'react'

import { explorerUrlFor } from 'utils/explorerUrlFor'
import { useAuth, useChain, useConnect, useStaking } from 'hooks'

import { StyledBalancerPoolHeader } from './styled'
import Button from 'components/Button'
import Icon from 'components/Icon'
import TokenIcon from 'components/TokenIcon'

function BalancerPoolHeader() {
  const { isConnected } = useAuth()
  const { chainId } = useChain()
  const { openConnectModal } = useConnect()

  const {
    lpToken,
    poolTokenAddresses,
    poolTokenSymbols,
    poolTokenWeightsInPcnt,
    shouldReversePoolTokenOrderOnDisplay,
  } = useStaking()

  return (
    <StyledBalancerPoolHeader
      className="poolHeader"
      $reverse={shouldReversePoolTokenOrderOnDisplay}
    >
      <strong className="poolName">{lpToken?.name}</strong>
      <div className="titleGroup">
        <h2 className="title">Join pool, Get LP Tokens!</h2>

        <div className="tokenList">
          {poolTokenAddresses?.map((addr, i) => (
            <a
              className="tokenItem"
              key={`poolHeader:${addr}`}
              href={explorerUrlFor(chainId, addr)}
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
    </StyledBalancerPoolHeader>
  )
}

export default memo(BalancerPoolHeader)
