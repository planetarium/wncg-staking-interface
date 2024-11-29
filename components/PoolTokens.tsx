import clsx from 'clsx'
import Link from 'next/link'

import { useBalances, useChain, usePropAmounts, useStaking } from 'hooks'
import { dexPoolUrlFor } from 'utils/dexPoolUrlFor'

import Icon from 'components/Icon'
import NumberFormat from 'components/NumberFormat'
import TokenIcon from 'components/TokenIcon'
import { bnum } from 'utils/bnum'
import { StyledPoolTokens } from './styled'

type PoolTokensProps = {
  className?: string
}

function PoolTokens({ className }: PoolTokensProps) {
  const { chainId, dexPlatformName } = useChain()
  const {
    lpToken,
    poolTokens,
    poolTokenWeights,
    shouldReversePoolTokenOrderOnDisplay,
  } = useStaking()
  const balanceOf = useBalances()

  const userLpBalance = balanceOf(lpToken?.address)

  const { propAmounts, propAmountsInFiatValue } = usePropAmounts(userLpBalance)

  return (
    <StyledPoolTokens className={className}>
      <header className="header">
        <Link href={dexPoolUrlFor(chainId)} target="_blank" rel="noopener">
          <h4 className="title">My tokens funded in pool</h4>

          <div className="tooltipGroup">
            <Icon icon="outlink" />
            <p className="tooltip">Go to {dexPlatformName}</p>
          </div>
        </Link>
      </header>

      <dl
        className={clsx('poolTokensList', {
          reverse: shouldReversePoolTokenOrderOnDisplay,
        })}
      >
        {poolTokens.map((token, i) => {
          const { address, symbol, decimals } = token
          const amount = propAmounts[i]
          const fiatValue = propAmountsInFiatValue[i]

          const weight = bnum(poolTokenWeights[i]).times(100).toNumber()

          return (
            <div className="poolTokensItem" key={`availableBalance:${address}`}>
              <dt>
                <TokenIcon address={address} $size={32} />
                <strong className="symbol">{symbol}</strong>
                <span className="pcnt">{weight}%</span>
              </dt>

              <dd>
                <NumberFormat
                  className="tokenAmount"
                  value={amount}
                  maxDecimals={decimals === 8 ? 6 : undefined}
                />
                <NumberFormat
                  className="fiatValue"
                  value={fiatValue}
                  type="fiat"
                  decimals={3}
                />
              </dd>
            </div>
          )
        })}
      </dl>
    </StyledPoolTokens>
  )
}

export default PoolTokens
