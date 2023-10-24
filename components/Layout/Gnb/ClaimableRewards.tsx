import dynamic from 'next/dynamic'

import { ModalType } from 'config/constants'
import { ANIMATION_MAP, MOTION } from 'config/constants/motions'
import { bnum } from 'utils/bnum'
import {
  useChain,
  useFiat,
  useIsHarvestable,
  useModal,
  useResponsive,
  useStaking,
} from 'hooks'
import { useFetchUserRewards } from 'hooks/queries'

import { StyledGnbClaimableRewards } from './styled'
import Button from 'components/Button'
import CountUp from 'components/CountUp'
import Icon from 'components/Icon'
import NumberFormat from 'components/NumberFormat'
import Tooltip from 'components/Tooltip'

function ClaimableRewards() {
  const { balAddress } = useChain()
  const toFiat = useFiat()
  const isHarvestable = useIsHarvestable()
  const { addModal } = useModal()
  const { isLaptop } = useResponsive()
  const { rewardTokenAddresses, tokens } = useStaking()

  const { data } = useFetchUserRewards()

  const { earnedTokenRewards = [] } = data ?? {}
  const hasRewards = earnedTokenRewards.some((amt) => bnum(amt).gt(0))

  function openClaim() {
    addModal({
      type: ModalType.Claim,
    })
  }

  return (
    <StyledGnbClaimableRewards
      key="GnbClaimableRewards"
      {...MOTION}
      variants={ANIMATION_MAP.fadeIn}
    >
      {rewardTokenAddresses?.map((addr, i) => {
        if (!addr) return null

        const amount = earnedTokenRewards[i]
        const fiatValue = toFiat(amount, addr)
        const symbol = tokens[addr]?.symbol

        const hasAmount = bnum(amount).gt(0)

        const showHarvest = isHarvestable && addr === balAddress

        return (
          <div className="reward" key={`gnb:claimableRewards:${addr}`}>
            <CountUp
              start={0}
              value={amount}
              symbol={symbol}
              plus={hasAmount}
              decimals={isLaptop ? 2 : undefined}
              maxDecimals={isLaptop ? 2 : undefined}
              abbr
            />

            {hasAmount && (
              <span className="parenthesis">
                <NumberFormat
                  value={fiatValue}
                  type="fiat"
                  decimals={isLaptop ? 2 : undefined}
                  maxDecimals={isLaptop ? 2 : undefined}
                  abbr
                />
              </span>
            )}

            {showHarvest && (
              <div className="tooltipGroup">
                <Icon className="toggler" icon="warning" />
                <Tooltip
                  message="BAL rewards have temporarily stopped streaming. Please execute harvest to resume the streaming."
                  $width={400}
                  $direction="bottom"
                />
              </div>
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
        Claim
      </Button>
    </StyledGnbClaimableRewards>
  )
}

export default dynamic(() => Promise.resolve(ClaimableRewards), {
  ssr: false,
})
