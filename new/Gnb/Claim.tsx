import { memo } from 'react'
import { AnimatePresence } from 'framer-motion'

import { ModalCategory } from 'states/ui'
import { countUpOption, usdCountUpOption } from 'constants/countUp'
import { fadeIn } from 'constants/motionVariants'
import { useAccount, useModal, useRewards } from 'hooks'

import { StyledClaim } from './styled'
import CountUp from 'new/CountUp'
import SvgIcon from 'new/SvgIcon'
import Button from 'new/Button'

function Claim() {
  const { isConnected } = useAccount()
  const { addModal } = useModal()
  const { rewards, rewardTokenSymbols, rewardsInFiatValue } = useRewards()

  function claim() {
    addModal({
      category: ModalCategory.ClaimReward,
    })
  }

  return (
    <AnimatePresence>
      {isConnected && (
        <StyledClaim
          className="claim"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeIn}
        >
          {rewardTokenSymbols.map((symbol, i) => {
            return (
              <div className="reward" key={`gnb:claim:${symbol}`}>
                <strong className="amount">
                  <CountUp {...countUpOption} end={rewards[i]} prefix="+" />
                </strong>
                <strong className="usd">
                  <SvgIcon icon="approximate" />
                  (
                  <CountUp {...usdCountUpOption} end={rewardsInFiatValue[i]} />)
                </strong>
                <span className="symbol">{symbol}</span>
              </div>
            )
          })}

          <Button className="claimButton" onClick={claim} $variant="tiny">
            Claim rewards
          </Button>
        </StyledClaim>
      )}
    </AnimatePresence>
  )
}

export default memo(Claim)
