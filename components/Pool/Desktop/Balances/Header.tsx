import { useMemo } from 'react'

import { bnum } from 'utils/bnum'
import { useAuth, useBalances, useFiat, useStaking } from 'hooks'
import { useFetchUserData } from 'hooks/queries'

import { StyledPoolBalancesHeader } from './styled'
import CountUp from 'components/CountUp'
import NumberFormat from 'components/NumberFormat'

export default function PoolBalancesHeader() {
  const { isConnected } = useAuth()
  const balanceOf = useBalances()
  const toFiat = useFiat()
  const { lpToken } = useStaking()

  const { stakedTokenBalance = '0' } = useFetchUserData().data ?? {}
  const availableBpt = balanceOf(lpToken.address)

  const totalBpt = useMemo(
    () => bnum(availableBpt).plus(stakedTokenBalance).toString(),
    [stakedTokenBalance, availableBpt]
  )

  const totalBalanceInFiatValue = toFiat(totalBpt, lpToken.address)

  return (
    <StyledPoolBalancesHeader className="poolBalancesHeader">
      <dl className="totalBalance">
        <dt>My total LP tokens</dt>
        <dd>
          {isConnected ? (
            <>
              <CountUp value={totalBpt} />
              <NumberFormat
                value={totalBalanceInFiatValue}
                prefix="$"
                decimals={2}
                approx
              />
            </>
          ) : (
            <p className="desc">
              After connecting the wallet, you can check the LP token you have.
            </p>
          )}
        </dd>
      </dl>
    </StyledPoolBalancesHeader>
  )
}
