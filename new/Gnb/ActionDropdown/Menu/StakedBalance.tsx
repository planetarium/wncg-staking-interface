import { memo, useMemo } from 'react'

import { ModalCategory } from 'states/ui'
import { renderStrong } from 'utils/numberFormat'
import { useFiatCurrency, useModal, useStakedBalance } from 'hooks'

import { StyledStakedBalance } from './styled'
import Button from 'new/Button'
import NumberFormat from 'new/NumberFormat'
import SvgIcon from 'new/SvgIcon'

type StakedBalanceProps = {
  close(): void
}

function StakedBalance({ close }: StakedBalanceProps) {
  const { getBptFiatValue } = useFiatCurrency()
  const { addModal } = useModal()
  const { hasStakedBalance, stakedBalance } = useStakedBalance()

  function withdraw() {
    addModal({
      category: ModalCategory.Withdraw,
    })
    close()
  }

  const fiatValue = useMemo(
    () => getBptFiatValue(stakedBalance),
    [getBptFiatValue, stakedBalance]
  )

  return (
    <StyledStakedBalance>
      <header className="header">
        <h2 className="title">My Staked LP</h2>

        <dl className="detail">
          <div className="detailItem">
            <dt className="hidden">Your balance</dt>
            <dd>
              <NumberFormat
                className="value"
                value={stakedBalance}
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

      {hasStakedBalance && (
        <div className="buttonGroup">
          <button className="earnButton">
            Earned <SvgIcon icon="chevronRight" $size={16} />
          </button>

          <Button onClick={withdraw} $variant="secondary" $size="md">
            Withdraw
          </Button>
        </div>
      )}
    </StyledStakedBalance>
  )
}

export default memo(StakedBalance)
