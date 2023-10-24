import { AnimatePresence, motion } from 'framer-motion'
import { useAtom, useAtomValue } from 'jotai'
import clsx from 'clsx'

import { periodFinishAtom, showHarvestTooltipAtom } from 'states/system'
import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import { bnum } from 'utils/bnum'
import { calcApr } from 'utils/calcApr'
import {
  useChain,
  useFiat,
  useHarvest,
  useIsHarvestable,
  useResponsive,
  useStaking,
} from 'hooks'
import { useFetchStaking } from 'hooks/queries'

import { StyledStakingDashboardApr } from './styled'
import Button from 'components/Button'
import CountUp from 'components/CountUp'
import Icon from 'components/Icon'
import Suspense from 'components/Suspense'
import Harvest from './Harvest'
import Skeleton from 'components/Skeleton'

function StakingDashboardApr() {
  const [show, setShow] = useAtom(showHarvestTooltipAtom)

  const { balAddress } = useChain()
  const isHarvestable = useIsHarvestable()
  const toFiat = useFiat()
  const harvest = useHarvest()
  const {
    lpToken,
    rewardTokenAddresses,
    rewardEmissionsPerSec,
    tokens,
    totalStaked: initTotalStaked,
  } = useStaking()
  const { isHandheld } = useResponsive()

  const { totalStaked = initTotalStaked } = useFetchStaking().data ?? {}

  const totalStakedInFiatValue = toFiat(
    totalStaked ?? initTotalStaked,
    lpToken?.address
  )

  const aprs = rewardEmissionsPerSec?.map((e, i) =>
    calcApr(
      e,
      toFiat(1, rewardTokenAddresses[i]) ?? '0',
      totalStakedInFiatValue
    )
  )
  const periodFinish = useAtomValue(periodFinishAtom) ?? '0'

  function toggleTooltip() {
    setShow((prev) => !prev)
  }

  function closeTooltip() {
    setShow(false)
  }

  return (
    <StyledStakingDashboardApr className="aprList" suppressHydrationWarning>
      <div className="aprItem">
        <dt>Total Staked</dt>
        <dd className="colon">
          <CountUp value={totalStakedInFiatValue} type="fiat" abbr />
        </dd>
      </div>

      {aprs?.map((apr, i) => {
        const addr = rewardTokenAddresses[i]
        if (!addr || !tokens[addr]) return null

        const { symbol } = tokens[addr]

        const isBAL = addr === balAddress
        const showShowHarvest = isBAL && !!isHarvestable

        if (isBAL && bnum(periodFinish).isZero()) {
          return (
            <div
              className={clsx('aprItem', { tooltipGroup: showShowHarvest })}
              key={`dashboardApr:${apr}:${symbol}`}
            >
              <dt className={clsx('hasTooltip', { show })}>{symbol} APR</dt>

              <dd className="colon">
                <Skeleton
                  className="aprItem"
                  $width={isHandheld ? 100 : 72}
                  $height={isHandheld ? 20 : 48}
                />
              </dd>
            </div>
          )
        }

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
              <CountUp value={apr} symbol="%" decimals={2} maxDecimals={2} />
            </dd>

            <AnimatePresence>
              {showShowHarvest && !!harvest && (
                <motion.div {...EXIT_MOTION} variants={ANIMATION_MAP.fadeIn}>
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

export default StakingDashboardApr
