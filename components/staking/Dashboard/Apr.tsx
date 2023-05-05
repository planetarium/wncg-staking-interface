import { memo, useState } from 'react'
import { useAtomValue } from 'jotai'
import clsx from 'clsx'

import { showHarvestAtom } from 'states/system'
import config from 'config'
import { MOTION } from 'config/motions'
import { fadeIn } from 'config/motionVariants'
import { useApr, useFiat, useRewards, useStaking } from 'hooks'
import { useFetchStaking } from 'hooks/queries'

import { StyledStakingDashboardApr } from './styled'
import CountUp from 'components/CountUp'
import Icon from 'components/Icon'
import Suspense from 'components/Suspense'
import Harvest from './Harvest'

function StakingDashboardApr() {
  const [show, setShow] = useState(true)

  const aprs = useApr()
  const toFiat = useFiat()
  const { stakedTokenAddress, rewardTokenAddresses } = useStaking()
  const { rewardTokenSymbols } = useRewards()

  const { totalStaked = '0' } =
    useFetchStaking({ refetchInterval: 30 * 1_000 }).data ?? {}
  const totalStakedInFiatValue = toFiat(totalStaked, stakedTokenAddress)

  const showHarvest = useAtomValue(showHarvestAtom)

  function toggleTooltip() {
    setShow((prev) => !prev)
  }

  function closeTooltip() {
    setShow(false)
  }

  return (
    <StyledStakingDashboardApr
      {...MOTION}
      className="aprList"
      variants={fadeIn}
    >
      <div className="aprItem">
        <dt>Total Staked</dt>
        <dd className="colon">
          <CountUp value={totalStaked} type="fiat" />
        </dd>
      </div>

      {aprs.map((apr, i) => {
        const symbol = rewardTokenSymbols[i]
        const addr = rewardTokenAddresses[i]

        const showShowHarvest = showHarvest && addr === config.bal

        return (
          <div
            className={clsx('aprItem', { tooltipGroup: showShowHarvest })}
            key={`dashboardApr:${apr}:${symbol}`}
          >
            <dt className={clsx('hasTooltip', { show })}>
              {symbol} APR
              {showShowHarvest && (
                <button
                  className="toggler"
                  type="button"
                  onClick={toggleTooltip}
                >
                  <Icon icon="warning" />
                </button>
              )}
              <Suspense>
                <Harvest show={show} closeTooltip={closeTooltip} />
              </Suspense>
            </dt>

            <dd className="colon">
              <CountUp
                value={apr ?? '0'}
                symbol="%"
                decimals={2}
                maxDecimals={2}
              />
            </dd>
          </div>
        )
      })}
    </StyledStakingDashboardApr>
  )
}

export default memo(StakingDashboardApr)
