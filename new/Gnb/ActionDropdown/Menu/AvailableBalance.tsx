import { memo } from 'react'

import { ModalCategory } from 'states/ui'
import { bnum } from 'utils/num'
import { renderStrong } from 'utils/numberFormat'
import { getTokenColor, getTokenSymbol } from 'utils/token'
import {
  useBalances,
  useFiatCurrency,
  useModal,
  usePool,
  usePropAmounts,
} from 'hooks'

import { StyledAvailableBalance } from './styled'
import Button from 'new/Button'
import NumberFormat from 'new/NumberFormat'
import SvgIcon from 'new/SvgIcon'
import TokenIcon from 'new/TokenIcon'

type AvailableBalanceProps = {
  close(): void
}

function AvailableBalance({ close }: AvailableBalanceProps) {
  const { bptBalance } = useBalances()
  const { getBptFiatValue } = useFiatCurrency()
  const { addModal } = useModal()
  const { poolTokenAddresses, poolTokenWeights } = usePool()
  const { propAmounts, propAmountsInFiatValue } = usePropAmounts()

  const fiatValue = getBptFiatValue(bptBalance)

  function exit() {
    addModal({
      category: ModalCategory.Exit,
    })

    close()
  }

  return (
    <StyledAvailableBalance>
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
        </dl>
      </header>

      <div className="content">
        <h3 className="subtitle">Coins you&apos;ve funded in pool</h3>

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

      <Button onClick={exit} $variant="secondary" $size="md">
        Exit pool
      </Button>
    </StyledAvailableBalance>
  )
}

export default memo(AvailableBalance)
