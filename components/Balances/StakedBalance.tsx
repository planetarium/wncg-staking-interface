import { ReactNode, useMemo } from 'react'
import clsx from 'clsx'

import { useAuth, useConnect, useFiat, useStaking } from 'hooks'

import { StyledStakedBalance } from './styled'
import NumberFormat from 'components/NumberFormat'
import { useFetchUserData } from 'hooks/queries'
import { bnum } from 'utils/bnum'

type StakedBalanceProps = {
  children?: ReactNode
  className?: string
}

function StakedBalance({ children, className }: StakedBalanceProps) {
  const { isConnected } = useAuth()
  const { openConnectModal } = useConnect()
  const toFiat = useFiat()
  const { lpToken } = useStaking()
  const { stakedTokenBalance = '0' } = useFetchUserData().data ?? {}

  const fiatValue = useMemo(
    () => toFiat(stakedTokenBalance, lpToken?.address),
    [lpToken?.address, stakedTokenBalance, toFiat]
  )

  const hasStakedTokenBalance = bnum(stakedTokenBalance).gt(0)

  return (
    <StyledStakedBalance className={clsx('stakedBalance', className)}>
      <header className="header">
        <h2 className="title">My Staked LP</h2>

        <dl className="detailList">
          <div className="detailItem">
            <dt className="hidden">Your balance</dt>
            <dd>
              {isConnected ? (
                <NumberFormat className="value" value={stakedTokenBalance} />
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

          {hasStakedTokenBalance && (
            <div className="detailItem">
              <dt className="hidden">Your balance in USD</dt>
              <dd className="fiatValue">
                <NumberFormat value={fiatValue} decimals={2} prefix="$" />
              </dd>
            </div>
          )}
        </dl>
      </header>

      {children}
    </StyledStakedBalance>
  )
}

export default StakedBalance
