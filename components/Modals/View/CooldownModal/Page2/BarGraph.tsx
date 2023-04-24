import { memo } from 'react'
import { motion } from 'framer-motion'
import { secondsInDay } from 'date-fns'

import { MOTION } from 'config/motions'
import { fadeIn } from 'config/motionVariants'
import { bnum } from 'utils/bnum'
import { useStaking } from 'hooks'

import { StyledCooldownModalPage2BarGraph } from './styled'
import NumberFormat from 'components/NumberFormat'

function CooldownModalPage2BarGraph() {
  const { cooldownPeriod, unstakePeriod } = useStaking()
  const totalPeriod = bnum(cooldownPeriod).plus(unstakePeriod).toString()

  const cooldownPcnt = bnum(cooldownPeriod)
    .div(totalPeriod)
    .times(100)
    .toString()

  const unstakePcnt = bnum(100).minus(cooldownPcnt).toString()
  const cooldownPeriodInDays = cooldownPeriod / secondsInDay
  const unstakePeriodInDays = unstakePeriod / secondsInDay

  return (
    <StyledCooldownModalPage2BarGraph>
      <motion.div
        className="bar cooldown"
        {...MOTION}
        variants={fadeIn}
        style={{ width: `${cooldownPcnt}%` }}
      >
        <dt>Cooldown</dt>
        <dd>
          <NumberFormat
            value={cooldownPeriodInDays}
            decimals={0}
            maxDecimals={2}
            suffix=" days"
          />
        </dd>
      </motion.div>

      <motion.div
        className="bar unstake"
        {...MOTION}
        variants={fadeIn}
        style={{ width: `${unstakePcnt}%` }}
      >
        <dt>Withdraw</dt>
        <dd>
          <NumberFormat
            value={unstakePeriodInDays}
            decimals={0}
            maxDecimals={2}
            suffix=" days"
          />
        </dd>
      </motion.div>
    </StyledCooldownModalPage2BarGraph>
  )
}

export default memo(CooldownModalPage2BarGraph)
