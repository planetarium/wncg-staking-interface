import { memo } from 'react'

import { configService } from 'services/config'
import { getBalancerPoolUrl } from 'utils/url'

import { StyledPoolInformation } from './styled'
import NumberFormat from 'new/NumberFormat'
import SvgIcon from 'new/SvgIcon'

const balancerPoolUrl = getBalancerPoolUrl(configService.poolId)

function PoolInformation() {
  return (
    <StyledPoolInformation className="poolInformation">
      <header className="header">
        <h3 className="title">Pool information</h3>
        <a
          className="link"
          href={balancerPoolUrl}
          target="_blank"
          rel="noopener"
        >
          detail
          <SvgIcon icon="export" $size={16} />
        </a>
      </header>

      <dl className="detail">
        <div className="detailItem">
          <dt>Pool value</dt>
          <dd>
            <NumberFormat value={12345} decimals={2} prefix="$" />
          </dd>
        </div>
        <div className="detailItem">
          <dt>Volume (24h)</dt>
          <dd>
            <NumberFormat value={12345} decimals={2} prefix="$" />
          </dd>
        </div>
        <div className="detailItem">
          <dt>Fees (24h)</dt>
          <dd>
            <NumberFormat value={12345} decimals={2} prefix="$" />
          </dd>
        </div>
      </dl>
    </StyledPoolInformation>
  )
}

export default memo(PoolInformation)
