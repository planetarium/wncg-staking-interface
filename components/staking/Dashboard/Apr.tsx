import { memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAtom, useAtomValue } from 'jotai'
import clsx from 'clsx'

import { isHarvestableAtom, showHarvestTooltipAtom } from 'states/system'
import config from 'config'
import { EXIT_MOTION, MOTION } from 'config/motions'
import { fadeIn } from 'config/motionVariants'
import { useApr, useFiat, useHarvest, useRewards, useStaking } from 'hooks'
import { useFetchStaking } from 'hooks/queries'

import { StyledStakingDashboardApr } from './styled'
import Button from 'components/Button'
import CountUp from 'components/CountUp'
import Icon from 'components/Icon'
import Suspense from 'components/Suspense'
import Harvest from './Harvest'

function StakingDashboardApr() {
  const [show, setShow] = useAtom(showHarvestTooltipAtom)

  const aprs = useApr()
  const toFiat = useFiat()
  const { stakedTokenAddress, rewardTokenAddresses } = useStaking()
  const { rewardTokenSymbols } = useRewards()
  const harvest = useHarvest()

  const { totalStaked = '0' } =
    useFetchStaking({ refetchInterval: 30 * 1_000 }).data ?? {}

  const totalStakedInFiatValue = toFiat(totalStaked, stakedTokenAddress)

  const isHarvestable = useAtomValue(isHarvestableAtom)

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
          <CountUp value={totalStakedInFiatValue} type="fiat" />
        </dd>
      </div>

      {aprs.map((apr, i) => {
        const symbol = rewardTokenSymbols[i]
        const addr = rewardTokenAddresses[i]

        const showShowHarvest = addr === config.bal && !!isHarvestable

        return (
          <div
            className={clsx('aprItem', { tooltipGroup: showShowHarvest })}
            key={`dashboardApr:${apr}:${symbol}`}
          >
            <dt className={clsx('hasTooltip', { show })}>
              {symbol} APR
              {showShowHarvest && (
                <>
                  <button
                    className="toggler"
                    type="button"
                    onClick={toggleTooltip}
                  >
                    <Icon icon="warning" />
                  </button>
                  <Suspense>
                    <Harvest show={show} closeTooltip={closeTooltip} />
                  </Suspense>
                </>
              )}
            </dt>

            <dd className="colon">
              <CountUp
                value={apr ?? '0'}
                symbol="%"
                decimals={2}
                maxDecimals={2}
              />
            </dd>

            <AnimatePresence>
              {showShowHarvest && !!harvest && (
                <motion.div {...EXIT_MOTION} variants={fadeIn}>
                  <Button
                    className="aprHarvestButton"
                    onClick={harvest}
                    $variant="tertiary"
                    $size="sm"
                    $contain
                  >
                    Harvest
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </StyledStakingDashboardApr>
  )
}

export default memo(StakingDashboardApr)
