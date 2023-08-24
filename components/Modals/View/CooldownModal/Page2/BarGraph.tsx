import { motion } from 'framer-motion'
import { secondsInDay } from 'date-fns'

import { ANIMATION_MAP, MOTION } from 'config/constants/motions'
import { bnum } from 'utils/bnum'
import { useStaking } from 'hooks'

import { StyledCooldownModalPage2BarGraph } from './styled'
import NumberFormat from 'components/NumberFormat'

function CooldownModalPage2BarGraph() {
  const { cooldownSeconds, withdrawSeconds } = useStaking()
  const totalPeriod = bnum(cooldownSeconds).plus(withdrawSeconds).toString()

  const cooldownPcnt = bnum(cooldownSeconds)
    .div(totalPeriod)
    .times(100)
    .toString()

  const unstakePcnt = bnum(100).minus(cooldownPcnt).toString()
  const cooldownSecondsInDays = cooldownSeconds / secondsInDay
  const withdrawSecondsInDays = withdrawSeconds / secondsInDay

  return (
    <StyledCooldownModalPage2BarGraph>
      <motion.div
        className="bar cooldown"
        {...MOTION}
        variants={ANIMATION_MAP.fadeIn}
        style={{ width: `${cooldownPcnt}%` }}
      >
        <dt>Cooldown</dt>
        <dd>
          <NumberFormat
            value={cooldownSecondsInDays}
            decimals={0}
            maxDecimals={2}
            suffix=" days"
          />
        </dd>
      </motion.div>

      <motion.div
        className="bar unstake"
        {...MOTION}
        variants={ANIMATION_MAP.fadeIn}
        style={{ width: `${unstakePcnt}%` }}
      >
        <dt>Withdraw</dt>
        <dd>
          <NumberFormat
            value={withdrawSecondsInDays}
            decimals={0}
            maxDecimals={2}
            suffix=" days"
          />
        </dd>
      </motion.div>
    </StyledCooldownModalPage2BarGraph>
  )
}

export default CooldownModalPage2BarGraph
