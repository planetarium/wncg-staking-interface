import { memo } from 'react'
import type { PropsWithChildren } from 'react'
import clsx from 'clsx'

import { bnum } from 'utils/num'
import { renderStrong } from 'utils/numberFormat'
import { getTokenColor, getTokenSymbol } from 'utils/token'
import { useBalances, useFiatCurrency, usePool, usePropAmounts } from 'hooks'

import { StyledAvailableBalance } from './styled'
import NumberFormat from 'new/NumberFormat'
import SvgIcon from 'new/SvgIcon'
import TokenIcon from 'new/TokenIcon'

type AvailableBalanceProps = {
  className?: string
} & PropsWithChildren

function AvailableBalance({ children, className }: AvailableBalanceProps) {
  const { bptBalance, hasBptBalance } = useBalances()
  const { getBptFiatValue } = useFiatCurrency()
  const { poolTokenAddresses, poolTokenWeights } = usePool()
  const { propAmounts, propAmountsInFiatValue } = usePropAmounts()

  const fiatValue = getBptFiatValue(bptBalance)

  return (
    <StyledAvailableBalance className={clsx('availableBalance', className)}>
      <header className="header">
        <h2 className="title">Available Stakable LP Tokens</h2>

        <dl className="detail">
          <div className="detailItem">
            <dt className="hidden">Your balance</dt>
            <dd>
              <NumberFormat
                className="value"
                value={bptBalance}
                renderText={renderStrong}
              />
            </dd>
          </div>

          {hasBptBalance && (
            <div className="detailItem">
              <dt className="hidden">Your balance in USD</dt>
              <dd className="fiatValue">
                <SvgIcon icon="approximate" $size={16} />
                <NumberFormat
                  value={fiatValue}
                  decimals={2}
                  prefix="$"
                  renderText={renderStrong}
                />
              </dd>
            </div>
          )}
        </dl>
      </header>

      {hasBptBalance && (
        <div className="content">
          <div className="subHeader">
            <h3
              className="subtitle"
              aria-describedby="availableBalance:tooltip"
            >
              Coins you&apos;ve funded in pool
            </h3>
            <div
              id="availableBalance:tooltip"
              className="tooltip"
              role="tooltip"
            >
              <button
                className="tooltipToggle"
                type="button"
                aria-label="Show tooltip"
              >
                <SvgIcon icon="info" $size={16} />
              </button>

              <div className="tooltipMessage">
                <p>
                  dummy text dummy text dummy textdummy text dummy text dummy
                  text
                </p>
              </div>
            </div>
          </div>

          <dl className="balanceList">
            {propAmounts.map((amount, i) => {
              const address = poolTokenAddresses[i]
              const weight = bnum(poolTokenWeights[i]).times(100).toNumber()
              const symbol = getTokenSymbol(address)
              const color = getTokenColor(address)

              if (!address || !weight) return null

              return (
                <div className="balanceItem" key={`availableBalance:${symbol}`}>
                  <dt>
                    <TokenIcon address={address} $size={32} />
                    <strong className="symbol" style={{ color }}>
                      {symbol}
                    </strong>
                    <span className="pcnt">{weight}%</span>
                  </dt>

                  <dd>
                    <NumberFormat
                      className="amount"
                      value={amount}
                      decimals={4}
                      renderText={renderStrong}
                    />
                    <div className="fiatValue">
                      <SvgIcon icon="approximate" $size={16} />
                      <NumberFormat
                        value={propAmountsInFiatValue[i]}
                        prefix="$"
                        decimals={2}
                        renderText={renderStrong}
                      />
                    </div>
                  </dd>
                </div>
              )
            })}
          </dl>
        </div>
      )}

      {children}
    </StyledAvailableBalance>
  )
}

export default memo(AvailableBalance)
