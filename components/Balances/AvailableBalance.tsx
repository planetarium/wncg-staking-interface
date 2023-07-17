import { memo, ReactNode } from 'react'
import clsx from 'clsx'

import { bnum } from 'utils/bnum'
import {
  useAuth,
  useBalances,
  useConnect,
  useFiat,
  usePropAmounts,
  useStaking,
} from 'hooks'

import { StyledAvailableBalance } from './styled'
import NumberFormat from 'components/NumberFormat'
import Icon from 'components/Icon'
import TokenIcon from 'components/TokenIcon'

type AvailableBalanceProps = {
  children?: ReactNode
  className?: string
}

function AvailableBalance({ children, className }: AvailableBalanceProps) {
  const { isConnected } = useAuth()
  const balancesFor = useBalances()
  const { openConnectModal } = useConnect()
  const toFiat = useFiat()
  const { lpToken, poolTokenAddresses, poolTokenWeights, tokens } = useStaking()

  const lpBalance = balancesFor(lpToken?.address)
  const hasBptBalance = bnum(lpBalance).gt(0)

  const { propAmounts, propAmountsInFiatValue } = usePropAmounts(lpBalance)

  const fiatValue = toFiat(lpBalance, lpToken?.address)

  return (
    <StyledAvailableBalance className={clsx('availableBalance', className)}>
      <header className="header">
        <h2 className="title">Available Stakable LP Tokens</h2>

        <dl className="detailList">
          <div className="detailItem">
            <dt className="hidden">Your balance</dt>
            <dd>
              {isConnected ? (
                <NumberFormat className="value" value={lpBalance} />
              ) : (
                <button
                  className="connectButton"
                  type="button"
                  onClick={openConnectModal}
                >
                  Connect wallet
                </button>
              )}
            </dd>
          </div>

          {hasBptBalance && (
            <div className="detailItem">
              <dt className="hidden">Your balance in USD</dt>
              <dd className="fiatValue">
                <NumberFormat value={fiatValue} decimals={2} prefix="$" />
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
                <Icon icon="info" />
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
            {propAmounts.map((amt, i) => {
              const address = poolTokenAddresses[i]
              const weight = bnum(poolTokenWeights[i]).times(100).toNumber()

              if (!address || !weight) return null

              const symbol = tokens[address]?.symbol

              return (
                <div className="balanceItem" key={`availableBalance:${symbol}`}>
                  <dt>
                    <TokenIcon address={address as Hash} $size={32} />
                    <strong className="symbol">{symbol}</strong>
                    <span className="pcnt">{weight}%</span>
                  </dt>

                  <dd>
                    <NumberFormat className="amount" value={amt} />
                    <div className="fiatValue">
                      <NumberFormat
                        value={propAmountsInFiatValue[i]}
                        type="fiat"
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
