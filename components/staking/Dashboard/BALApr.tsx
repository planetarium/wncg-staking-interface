import { useQuery } from '@tanstack/react-query'
import { useAtom, useAtomValue } from 'jotai'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'

import { periodFinishAtom, showHarvestTooltipAtom } from 'states/system'
import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import { QUERY_KEYS } from 'config/constants/queryKeys'
import { fetchAprs } from 'lib/queries/fetchAprs'
import { bnum } from 'utils/bnum'
import {
  useChain,
  useHarvest,
  useIsHarvestable,
  useResponsive,
  useStaking,
} from 'hooks'

import Button from 'components/Button'
import CountUp from 'components/CountUp'
import Icon from 'components/Icon'
import Skeleton from 'components/Skeleton'
import Suspense from 'components/Suspense'
import Harvest from './Harvest'

type StakingDashboardBALAprProps = {
  totalStaked: string
}

function StakingDashboardBALApr({ totalStaked }: StakingDashboardBALAprProps) {
  const [show, setShow] = useAtom(showHarvestTooltipAtom)
  const periodFinish = useAtomValue(periodFinishAtom) ?? '0'

  const { balAddress, chainId } = useChain()
  const isHarvestable = useIsHarvestable()
  const harvest = useHarvest()
  const { rewardTokenAddresses, tokens } = useStaking()
  const { isHandheld } = useResponsive()

  const { data: aprs = [] } = useQuery(
    [QUERY_KEYS.Staking.Apr, chainId, totalStaked],
    () => fetchAprs(chainId, totalStaked),
    {
      cacheTime: Infinity,
      suspense: true,
      refetchOnWindowFocus: 'always',
    }
  )

  function toggleTooltip() {
    setShow((prev) => !prev)
  }

  function closeTooltip() {
    setShow(false)
  }

  if (bnum(periodFinish).isZero()) {
    return (
      <div className={clsx('aprItem', { tooltipGroup: !!isHarvestable })}>
        <dt className={clsx('hasTooltip', { show })}>BAL APR</dt>

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

  const balIndex = rewardTokenAddresses.indexOf(balAddress ?? '0x')

  if (balIndex < 0) return null

  return (
    <div className={clsx('aprItem', { tooltipGroup: !!isHarvestable })}>
      <dt className={clsx('hasTooltip', { show })}>
        BAL APR
        {!!isHarvestable && (
          <>
            <button className="toggler" type="button" onClick={toggleTooltip}>
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
          value={aprs[balIndex] ?? '0'}
          symbol="%"
          decimals={2}
          maxDecimals={2}
        />
      </dd>

      <AnimatePresence>
        {!!isHarvestable && !!harvest && (
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
}

export default StakingDashboardBALApr
