import { useAtomValue } from 'jotai'

import { totalStakedAtom } from 'states/staking'
import { countUpOption, percentCountUpOption } from 'constants/countUp'
import { useApr } from 'hooks'
import { useStaking } from 'hooks/contracts'

import { StyledStakingDashboard } from './styled'
import CountUp from 'new/CountUp'

function StakingDashboard() {
  const { aprs } = useApr()
  const { rewardTokenSymbols } = useStaking()

  const totalStaked = useAtomValue(totalStakedAtom)

  return (
    <StyledStakingDashboard>
      <dl className="detail">
        <div className="detailItem">
          <dt>Total Staked</dt>
          <dd>
            <CountUp {...countUpOption} end={totalStaked} showAlways />
          </dd>
        </div>

        {rewardTokenSymbols.map((symbol, i) => {
          return (
            <div className="detailItem" key={`rewardApr.${symbol}`}>
              <dt>{symbol} APR</dt>
              <dd>
                <CountUp {...percentCountUpOption} end={aprs[i]} showAlways />
              </dd>
            </div>
          )
        })}
      </dl>
    </StyledStakingDashboard>
  )
}

export default StakingDashboard
