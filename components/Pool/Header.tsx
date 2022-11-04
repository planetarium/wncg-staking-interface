import { memo } from 'react'

import { getEtherscanUrl } from 'utils/url'
import { usePool } from 'hooks'

import { StyledPoolHeader } from './styled'
import SvgIcon from 'components/SvgIcon'
import TokenIcon from 'components/TokenIcon'

function PoolHeader() {
  const {
    poolName,
    poolTokenAddresses,
    poolTokenColors,
    poolTokenSymbols,
    poolTokenWeightsInPcnt,
  } = usePool()

  return (
    <StyledPoolHeader className="poolHeader">
      <strong className="poolName">{poolName}</strong>

      <div className="titleGroup">
        <h2 className="title">Join pool, Get LP Tokens!</h2>

        <div className="tokenList">
          {poolTokenAddresses.map((address, i) => (
            <a
              className="tokenItem"
              key={`poolHeader:${address}`}
              href={getEtherscanUrl(address)}
              target="_blank"
              rel="noopener"
              aria-label="Open in Etherscan"
            >
              <TokenIcon address={address} $size={20} />
              <strong className="symbol" style={{ color: poolTokenColors[i] }}>
                {poolTokenSymbols[i]}
              </strong>

              <span className="weight">{poolTokenWeightsInPcnt[i]}%</span>
              <SvgIcon icon="export" />
            </a>
          ))}
        </div>
      </div>
    </StyledPoolHeader>
  )
}

export default memo(PoolHeader)
