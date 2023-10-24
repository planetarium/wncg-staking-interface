import { useResponsive, useStaking } from 'hooks'

import {
  StyledStakingDashboardApr,
  StyledStakingDashboardAprFallback,
} from './styled'
import Skeleton from 'components/Skeleton'
import Button from 'components/Button'
import Icon from 'components/Icon'

type StakingDashboardAprFallbackProps = {
  refetch(): void
}

export default function StakingDashboardAprFallback({
  refetch,
}: StakingDashboardAprFallbackProps) {
  const { isHandheld } = useResponsive()
  const { rewardTokenAddresses, tokens } = useStaking()

  if (isHandheld) {
    return (
      <StyledStakingDashboardAprFallback>
        <p className="errorMsg">
          <Icon icon="warning" $size={isHandheld ? 16 : 24} />
          Failed to load the data.
          <br />
          Please refresh to try again.
          <Button
            className="retryButton"
            onClick={refetch}
            $size="sm"
            $contain
            $variant="tertiary"
          >
            Retry
          </Button>
        </p>
      </StyledStakingDashboardAprFallback>
    )
  }

  return (
    <StyledStakingDashboardAprFallback>
      <StyledStakingDashboardApr className="aprList">
        <div className="aprItem">
          <dt>Total Staked</dt>
          <dd className="colon">
            <span className="countUp">-</span>
          </dd>
        </div>

        {rewardTokenAddresses?.map((addr, i) => {
          const { symbol } = tokens[addr] ?? {}
          return (
            <div className="aprItem" key={`dashboardApr:${addr}`}>
              <dt>{symbol} APR</dt>
              <dd className="colon">
                <span className="countUp">-</span>
              </dd>
            </div>
          )
        })}
      </StyledStakingDashboardApr>

      <p className="errorMsg">
        <Icon icon="warning" $size={24} />
        Failed to load the data. Please refresh to try again.
        <Button
          className="retryButton"
          onClick={refetch}
          $size="sm"
          $contain
          $variant="tertiary"
        >
          Retry
        </Button>
      </p>
    </StyledStakingDashboardAprFallback>
  )
}
