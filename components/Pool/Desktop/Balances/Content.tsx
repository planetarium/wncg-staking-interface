import { bnum } from 'utils/bnum'
import { useAuth, useBalances, useFiat, useStaking } from 'hooks'
import { useFetchUserData } from 'hooks/queries'

import { StyledPoolBalancesContent } from './styled'
import CountUp from 'components/CountUp'
import NumberFormat from 'components/NumberFormat'
import PoolTokens from 'components/PoolTokens'

export default function PoolBalancesContent() {
  const { isConnected } = useAuth()
  const toFiat = useFiat()
  const { stakedTokenAddress } = useStaking()

  const balanceOf = useBalances()
  const { stakedTokenBalance = '0' } = useFetchUserData().data ?? {}

  const stakedTokenFiatValue = toFiat(stakedTokenBalance, stakedTokenAddress)

  const bptBalance = balanceOf(stakedTokenAddress)
  const hasLpToken = !!isConnected && bnum(bptBalance).gt(0)
  const fiatValue = toFiat(bptBalance, stakedTokenAddress)
  const hasStakedToken = !!isConnected && bnum(stakedTokenBalance).gt(0)

  return (
    <StyledPoolBalancesContent>
      <header className="header">
        <h3 className="title">My staked LP tokens</h3>

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
        <h3 className="title">Stakable LP tokens</h3>

        {!!isConnected ? (
          <div className="amount">
            <CountUp value={bptBalance} />
            {hasLpToken && <NumberFormat value={fiatValue} type="fiat" />}
          </div>
        ) : (
          <p className="placeholder">-</p>
        )}
      </header>

      {hasLpToken && (
        <PoolTokens className="poolTokens" bptBalance={bptBalance} />
      )}
    </StyledPoolBalancesContent>
  )
}
