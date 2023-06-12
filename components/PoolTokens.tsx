import { memo } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

import config from 'config'
import { dexPoolUrlFor } from 'utils/dexPoolUrlFor'
import { useChain, usePropAmounts, useStaking } from 'hooks'

import { StyledPoolTokens } from './styled'
import Icon from 'components/Icon'
import NumberFormat from 'components/NumberFormat'
import TokenIcon from 'components/TokenIcon'

type PoolTokensProps = {
  lpBalance: string
  className?: string
}

function PoolTokens({ lpBalance, className }: PoolTokensProps) {
  const { chainId } = useChain()
  const { poolTokens, shouldReversePoolTokenOrderOnDisplay } = useStaking()
  const { propAmounts, propAmountsInFiatValue } = usePropAmounts(lpBalance)

  return (
    <StyledPoolTokens className={className}>
      <header className="header">
        <Link href={dexPoolUrlFor(chainId)} target="_blank" rel="noopener">
          <h4 className="title">My tokens funded in pool</h4>

          <div className="tooltipGroup">
            <Icon icon="outlink" />
            <p className="tooltip">Go to {config.dexPlatformName}</p>
          </div>
        </Link>
      </header>

      <dl
        className={clsx('poolTokensList', {
          reverse: shouldReversePoolTokenOrderOnDisplay,
        })}
      >
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
