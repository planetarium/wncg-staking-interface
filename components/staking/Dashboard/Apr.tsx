import dynamic from 'next/dynamic'
import { memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAtom, useAtomValue } from 'jotai'
import clsx from 'clsx'

import { isHarvestableAtom, showHarvestTooltipAtom } from 'states/system'
import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import { isEthereum } from 'utils/isEthereum'
import { calcApr } from 'utils/calcApr'
import { useChain, useFiat, useHarvest, useStaking } from 'hooks'
import { useFetchStaking } from 'hooks/queries'

import { StyledStakingDashboardApr } from './styled'
import Button from 'components/Button'
import CountUp from 'components/CountUp'
import Icon from 'components/Icon'
import Suspense from 'components/Suspense'
import Harvest from './Harvest'

function StakingDashboardApr() {
  const [show, setShow] = useAtom(showHarvestTooltipAtom)

  const { balAddress, chainId } = useChain()
  const toFiat = useFiat()
  const harvest = useHarvest()
  const {
    lpToken,
    rewardTokenAddresses,
    rewardEmissionsPerSec,
    tokens,
    totalStaked: initTotalStaked,
  } = useStaking()

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

  const isHarvestable = useAtomValue(isHarvestableAtom) && isEthereum(chainId)

  function toggleTooltip() {
    setShow((prev) => !prev)
  }

  function closeTooltip() {
    setShow(false)
  }

  return (
    <StyledStakingDashboardApr className="aprList">
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

        const showShowHarvest = !!isHarvestable && addr === balAddress

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

export default dynamic(() => Promise.resolve(memo(StakingDashboardApr)), {
  ssr: false,
})
