import { memo, useMemo, useState } from 'react'

import { bnum } from 'utils/num'
import { renderStrong } from 'utils/numberFormat'
import {
  useAccount,
  useBalances,
  useConnectWallets,
  useFiatCurrency,
  usePool,
  useStakedBalance,
} from 'hooks'

import { StyledPoolBalances } from './styled'
import AvailableBalance from 'new/Balances/AvailableBalance'
import StakedBalance from 'new/Balances/StakedBalance'
import NumberFormat from 'new/NumberFormat'
import SvgIcon from 'new/SvgIcon'
import TokenIcon from 'new/TokenIcon'

function PoolBalances() {
  const [show, setShow] = useState(false)
  const [overflow, setOverflow] = useState<'hidden' | 'visible'>('hidden')

  const { isConnected } = useAccount()
  const { bptBalance } = useBalances()
  const { connect } = useConnectWallets()
  const { bptToFiat } = useFiatCurrency()
  const { poolName, poolTokenAddresses } = usePool()
  const { stakedBalance } = useStakedBalance()

  const totalBalance = useMemo(
    () => bnum(bptBalance).plus(stakedBalance).toNumber(),
    [bptBalance, stakedBalance]
  )

  const totalBalanceInFiatValue = bptToFiat(totalBalance)

  function toggle() {
    setShow((prev) => !prev)
    setOverflow('hidden')
  }

  function pauseOverflowHidden() {
    if (show) setOverflow('visible')
  }

  return (
    <StyledPoolBalances
      className="poolBalances"
      onTransitionEnd={pauseOverflowHidden}
      $show={show}
      $overflow={overflow}
    >
      <header className="balanceHeader">
        <div className="tokenGroup">
          {poolTokenAddresses.map((address) => (
            <TokenIcon
              key={`poolBalance:${address}`}
              address={address}
              $size={48}
            />
          ))}
        </div>
        <h2 className="title">{poolName}</h2>

        <dl className="totalBalance">
          <dt>Your total LP tokens</dt>

          <dd>
            {isConnected ? (
              <>
                <NumberFormat
                  className="amount"
                  value={totalBalance}
                  decimals={4}
                  renderText={renderStrong}
                />
                <div className="fiatValue">
                  <SvgIcon icon="approximate" $size={24} />
                  <NumberFormat
                    value={totalBalanceInFiatValue}
                    prefix="$"
                    decimals={2}
                    renderText={renderStrong}
                  />
                </div>
              </>
            ) : (
              <button className="connectButton" type="button" onClick={connect}>
                Connect wallet
              </button>
            )}
          </dd>
        </dl>
      </header>

      <div className="collapse">
        <StakedBalance />
        <AvailableBalance />
      </div>

      <button
        className="collapseToggle"
        type="button"
        onClick={toggle}
        aria-controls="poolBalance:collapse"
        aria-expanded={show}
      >
        {show ? 'Close' : 'Open'}
        <SvgIcon icon={show ? 'chevronUp' : 'chevronDown'} />
      </button>
    </StyledPoolBalances>
  )
}

export default memo(PoolBalances)
