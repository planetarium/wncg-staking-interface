import { useAtomValue } from 'jotai'
import { AnimatePresence } from 'framer-motion'

import { isHarvestableAtom } from 'states/system'
import config from 'config'
import { EXIT_MOTION } from 'config/motions'
import { fadeIn } from 'config/motionVariants'
import { useFiat, useHarvest } from 'hooks'
import { useFetchStaking } from 'hooks/queries'

import { StyledStakingDashboardHarvest } from './styled'
import Button from 'components/Button'
import CountUp from 'components/CountUp'
import Icon from 'components/Icon'
import Tooltip from 'components/Tooltip'

type StakingDashboardHarvestProps = {
  show: boolean
  closeTooltip(): void
}

export default function StakingDashboardHarvest({
  show,
  closeTooltip,
}: StakingDashboardHarvestProps) {
  const toFiat = useFiat()
  const { claimableTokens = '0' } =
    useFetchStaking({
      refetchInterval: 10 * 1_000,
      refetchOnWindowFocus: 'always',
    }).data ?? {}
  const harvest = useHarvest()

  const isHarvestable = useAtomValue(isHarvestableAtom)

  if (!isHarvestable) return null

  const claimableTokensFiatValue = toFiat(claimableTokens, config.bal)

  return (
    <AnimatePresence>
      {show && (
        <StyledStakingDashboardHarvest {...EXIT_MOTION} variants={fadeIn}>
          <Tooltip
            as="div"
            className="harvestTooltip"
            $direction="top"
            $align="center"
            $gap={20}
            $width={540}
            $float
          >
            <header className="tooltipHeader">
              <h4 className="title">
                BAL rewards have temporarily stopped streaming. Please execute
                harvest to resume the reward streaming.
              </h4>

              <button
                className="closeButton"
                type="button"
                onClick={closeTooltip}
              >
                <Icon icon="close" $size={24} />
              </button>
            </header>

            <footer className="tooltipFooter">
              <p className="desc">
                Get <CountUp value={claimableTokens} />
                <span className="parenthesis">
                  <CountUp value={claimableTokensFiatValue} type="fiat" />
                </span>{' '}
                as a reward!
              </p>

              {harvest && (
                <Button
                  className="harvestButton"
                  onClick={harvest}
                  $variant="tertiary"
                  $size="sm"
                  $contain
                >
                  Harvest
                </Button>
              )}
            </footer>
          </Tooltip>
        </StyledStakingDashboardHarvest>
      )}
    </AnimatePresence>
  )
}
