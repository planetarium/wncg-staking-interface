import { memo } from 'react'
import { useAtomValue } from 'jotai'

import { showHarvestAtom } from 'states/system'
import { ModalType } from 'config/constants'
import { MOTION } from 'config/motions'
import { fadeIn } from 'config/motionVariants'
import { bnum } from 'utils/bnum'
import { useFiat, useModal, useResponsive, useStaking } from 'hooks'
import { useFetchUserData } from 'hooks/queries'

import { StyledGnbClaimableRewards } from './styled'
import Button from 'components/Button'
import CountUp from 'components/CountUp'
import NumberFormat from 'components/NumberFormat'
import Icon from 'components/Icon'
import config from 'config'
import Tooltip from 'components/Tooltip'

function ClaimableRewards() {
  const toFiat = useFiat()
  const { addModal } = useModal()
  const { isLaptop } = useResponsive()
  const { rewardTokenAddresses, tokenMap } = useStaking()

  const { data } = useFetchUserData()

  const { earnedRewards = [] } = data ?? {}
  const hasRewards = earnedRewards.some((r) => bnum(r).gt(0))

  const showHarvest = useAtomValue(showHarvestAtom)

  function openClaim() {
    addModal({
      type: ModalType.Claim,
    })
  }

  return (
    <StyledGnbClaimableRewards {...MOTION} variants={fadeIn}>
      {rewardTokenAddresses?.map((addr, i) => {
        const amount = earnedRewards[i]
        const fiatValue = toFiat(amount, addr)
        const { symbol } = tokenMap[addr]
        const hasAmount = bnum(amount).gt(0)

        const showEarmarkTooltip = showHarvest && addr === config.bal

        return (
          <div className="reward" key={`gnb:claimableRewards:${addr}`}>
            <CountUp
              value={amount}
              symbol={symbol}
              plus={hasAmount}
              decimals={isLaptop ? 2 : undefined}
              maxDecimals={isLaptop ? 2 : undefined}
            />

            {showEarmarkTooltip && (
              <div className="tooltipGroup">
                <Icon className="toggler" icon="warning" />
                <Tooltip
                  message="BAL Rewards have temporarily stopped streaming. Please call the harvest method to start that streaming again."
                  $direction="bottom"
                  $width={360}
                />
              </div>
            )}

            {hasAmount && (
              <span className="parenthesis">
                <NumberFormat
                  value={fiatValue}
                  type="fiat"
                  decimals={isLaptop ? 2 : undefined}
                  maxDecimals={isLaptop ? 2 : undefined}
                />
              </span>
            )}
          </div>
        )
      })}

      <Button
        className="claimButton"
        onClick={openClaim}
        disabled={!hasRewards}
        $contain
        $size="sm"
        $variant="tertiary"
      >
        Claim rewards
      </Button>
    </StyledGnbClaimableRewards>
  )
}

export default memo(ClaimableRewards)
