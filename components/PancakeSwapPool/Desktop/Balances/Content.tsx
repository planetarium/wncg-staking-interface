import { bnum } from 'utils/bnum'
import { useAuth, useBalances, useFiat, useStaking } from 'hooks'
import { useFetchUserData } from 'hooks/queries'

import { StyledAddLiquidityPoolBalancesContent } from './styled'
import CountUp from 'components/CountUp'
import NumberFormat from 'components/NumberFormat'
import PoolTokens from 'components/PoolTokens'

export default function AddLiquidityPoolBalancesContent() {
  const { isConnected } = useAuth()
  const toFiat = useFiat()
  const { lpToken } = useStaking()

  const balanceOf = useBalances()
  const { stakedTokenBalance = '0' } = useFetchUserData().data ?? {}

  const stakedTokenFiatValue = toFiat(stakedTokenBalance, lpToken.address)

  const lpBalance = balanceOf(lpToken.address)
  const hasLpToken = !!isConnected && bnum(lpBalance).gt(0)
  const fiatValue = toFiat(lpBalance, lpToken.address)
  const hasStakedToken = !!isConnected && bnum(stakedTokenBalance).gt(0)

  return (
    <StyledAddLiquidityPoolBalancesContent>
      <header className="header">
        <h3 className="title">My staked Cake-LP</h3>

        {!!isConnected ? (
          <div className="amount">
            <CountUp value={stakedTokenBalance} />
            {hasStakedToken && (
              <NumberFormat value={stakedTokenFiatValue} type="fiat" />
            )}
          </div>
        ) : (
          <p className="placeholder">-</p>
        )}
      </header>

      <span className="divider" />

      <header className="header">
        <h3 className="title">Stakable Cake-LP</h3>

        {!!isConnected ? (
          <div className="amount">
            <CountUp value={lpBalance} />
            {hasLpToken && <NumberFormat value={fiatValue} type="fiat" />}
          </div>
        ) : (
          <p className="placeholder">-</p>
        )}
      </header>

      {hasLpToken && (
        <PoolTokens className="poolTokens" lpBalance={lpBalance} />
      )}
    </StyledAddLiquidityPoolBalancesContent>
  )
}
