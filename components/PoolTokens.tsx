import { memo } from 'react'
import Link from 'next/link'

import { StyledPoolTokens } from './styled'
import { poolUrlFor } from 'utils/poolUrlFor'
import { usePropAmounts, useStaking } from 'hooks'

import config from 'config'
import Icon from 'components/Icon'
import NumberFormat from 'components/NumberFormat'
import TokenIcon from 'components/TokenIcon'

type PoolTokensProps = {
  bptBalance: string
  className?: string
}

function PoolTokens({ bptBalance, className }: PoolTokensProps) {
  const { poolTokens } = useStaking()
  const { propAmounts, propAmountsInFiatValue } = usePropAmounts(bptBalance)

  return (
    <StyledPoolTokens className={className}>
      <header className="header">
        <Link href={poolUrlFor()} target="_blank" rel="noopener">
          <h4 className="title">My tokens funded in pool</h4>

          <div className="tooltipGroup">
            <Icon icon="outlink" />
            <p className="tooltip">Go to {config.dexPlatformName}</p>
          </div>
        </Link>
      </header>

      <dl className="poolTokensList">
        {poolTokens.map((token, i) => {
          const { address, symbol } = token
          const amount = propAmounts[i]
          const fiatValue = propAmountsInFiatValue[i]

          return (
            <div className="poolTokensItem" key={`availableBalance:${address}`}>
              <dt>
                <TokenIcon address={address} $size={32} />
                <strong className="symbol">{symbol}</strong>
                <span className="pcnt">50%</span>
              </dt>

              <dd>
                <NumberFormat className="tokenAmount" value={amount} />
                <NumberFormat
                  className="fiatValue"
                  value={fiatValue}
                  type="fiat"
                />
              </dd>
            </div>
          )
        })}
      </dl>
    </StyledPoolTokens>
  )
}

export default memo(PoolTokens)
