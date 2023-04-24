import { memo } from 'react'

import { poolUrlFor } from 'utils/poolUrlFor'

import { StyledPoolInformation } from './styled'
import Icon from 'components/Icon'
import NumberFormat from 'components/NumberFormat'
import { usePool } from 'hooks/usePool'

function PoolInformation() {
  const { poolValueIn24Hr, totalSwapVolumeIn24Hr, totalSwapFeesIn24Hr } =
    usePool()

  return (
    <StyledPoolInformation className="poolInformation">
      <header className="header">
        <h3 className="title">Pool information</h3>
        <a className="link" href={poolUrlFor()} target="_blank" rel="noopener">
          detail
          <Icon icon="outlink" />
        </a>
      </header>

      <dl className="detailList">
        <div className="detailItem">
          <dt>Pool value</dt>
          <dd>
            <NumberFormat value={poolValueIn24Hr} type="fiat" />
          </dd>
        </div>
        <div className="detailItem">
          <dt>Volume (24h)</dt>
          <dd>
            <NumberFormat value={totalSwapVolumeIn24Hr} type="fiat" />
          </dd>
        </div>
        <div className="detailItem">
          <dt>Fees (24h)</dt>
          <dd>
            <NumberFormat value={totalSwapFeesIn24Hr} type="fiat" />
          </dd>
        </div>
      </dl>
    </StyledPoolInformation>
  )
}

export default memo(PoolInformation)
