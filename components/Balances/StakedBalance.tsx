import { memo, ReactNode, useMemo } from 'react'
import clsx from 'clsx'

import { renderStrong } from 'utils/numberFormat'
import {
  useAccount,
  useConnectWallets,
  useFiatCurrency,
  useStakedBalance,
} from 'hooks'

import { StyledStakedBalance } from './styled'
import NumberFormat from 'components/NumberFormat'
import SvgIcon from 'components/SvgIcon'

type StakedBalanceProps = {
  children?: ReactNode
  className?: string
}

function StakedBalance({ children, className }: StakedBalanceProps) {
  const { isConnected } = useAccount()
  const { connect } = useConnectWallets()
  const { bptToFiat } = useFiatCurrency()
  const { hasStakedBalance, stakedBalance } = useStakedBalance()

  const fiatValue = useMemo(
    () => bptToFiat(stakedBalance),
    [bptToFiat, stakedBalance]
  )

  return (
    <StyledStakedBalance className={clsx('stakedBalance', className)}>
      <header className="header">
        <h2 className="title">My Staked LP</h2>

        <dl className="detailList">
          <div className="detailItem">
            <dt className="hidden">Your balance</dt>
            <dd>
              {isConnected ? (
                <NumberFormat
                  className="value"
                  value={stakedBalance}
                  renderText={renderStrong}
                />
              ) : (
                <button
                  className="connectButton"
                  type="button"
                  onClick={connect}
                >
                  Connect wallet
                </button>
              )}
            </dd>
          </div>

          {hasStakedBalance && (
            <div className="detailItem">
              <dt className="hidden">Your balance in USD</dt>
              <dd className="fiatValue">
                <SvgIcon icon="approximate" />
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

      {children}
    </StyledStakedBalance>
  )
}

export default memo(StakedBalance)
