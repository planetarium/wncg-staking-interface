import { explorerUrlFor } from 'utils/explorerUrlFor'
import { useAuth, useChain, useStaking } from 'hooks'

import { StyledPoolHeader } from './styled'
import Button from 'components/Button'
import Icon from 'components/Icon'
import TokenIcon from 'components/TokenIcon'
import { ConnectButton } from '@rainbow-me/rainbowkit'

function PoolHeader() {
  const { isConnected } = useAuth()
  const { chainId } = useChain()

  const {
    lpToken,
    poolTokenAddresses,
    poolTokenSymbols,
    poolTokenWeightsInPcnt,
    shouldReversePoolTokenOrderOnDisplay,
  } = useStaking()

  return (
    <StyledPoolHeader
      className="poolHeader"
      $reverse={shouldReversePoolTokenOrderOnDisplay}
    >
      <strong className="poolName">{lpToken?.name}</strong>
      <div className="titleGroup">
        <h2 className="title">Join pool, Get Cake-LP!</h2>

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
        <ConnectButton.Custom>
          {({ openConnectModal }) => (
            <Button
              className="connectButton"
              $size="lg"
              onClick={openConnectModal}
            >
              Connect wallet
            </Button>
          )}
        </ConnectButton.Custom>
      )}
    </StyledPoolHeader>
  )
}

export default PoolHeader
