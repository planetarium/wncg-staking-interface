import { useResponsive } from 'hooks'

import Button from 'components/Button'
import Icon from 'components/Icon'
import Tooltip from 'components/Tooltip'

type StakingDashboardAprItemFallbackProps = {
  symbol: string
  refetch(): void
}

function StakingDashboardAprItemFallback({
  symbol,
  refetch,
}: StakingDashboardAprItemFallbackProps) {
  const { isHandheld } = useResponsive()

  return (
    <div className="aprItem fallback">
      <dt>
        {symbol} APR
        <div className="tooltipGroup">
          <button className="toggler">
            <Icon icon="warning" $size={16} />
          </button>

          {!isHandheld && (
            <Tooltip
              $direction="top"
              $align="left"
              $float
              $gap={16}
              $width={250}
            >
              <Icon icon="warning" />
              Failed to load {symbol} APR.
              <br />
              Please reload to try again.
            </Tooltip>
          )}
        </div>
      </dt>

      <dd className="colon">
        {!isHandheld && <span className="countUp">-</span>}
      </dd>

      {isHandheld ? (
        <button className="refreshButton" onClick={refetch}>
          <Icon icon="refreshOn" $size={24} />
        </button>
      ) : (
        <Button
          className="retryButton"
          onClick={refetch}
          $contain
          $variant="tertiary"
          $size="sm"
        >
          Retry
        </Button>
      )}
    </div>
  )
}

export default StakingDashboardAprItemFallback
