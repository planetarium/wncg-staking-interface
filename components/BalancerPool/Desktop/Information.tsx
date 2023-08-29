import { dexPoolUrlFor } from 'utils/dexPoolUrlFor'
import { useChain } from 'hooks'
import { usePoolSnapshot } from 'hooks/usePoolSnapshot'

import { StyledBalancerPoolInformation } from './styled'
import Icon from 'components/Icon'
import NumberFormat from 'components/NumberFormat'

function BalancerPoolInformation() {
  const { poolValueIn24Hr, totalSwapVolumeIn24Hr, totalSwapFeesIn24Hr } =
    usePoolSnapshot()
  const { chainId } = useChain()

  return (
    <StyledBalancerPoolInformation className="poolInformation">
      <header className="header">
        <h3 className="title">Pool information</h3>
        <a
          className="link"
          href={dexPoolUrlFor(chainId)}
          target="_blank"
          rel="noopener"
        >
          Detail
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
    </StyledBalancerPoolInformation>
  )
}

export default BalancerPoolInformation
