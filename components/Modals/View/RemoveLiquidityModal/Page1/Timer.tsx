import type { UseFormSetValue } from 'react-hook-form'
import { motion } from 'framer-motion'

import { RemoveLiquidityField } from 'config/constants'
import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import { joinCountdown } from 'utils/joinCountdown'
import { useCountdown } from 'hooks'
import type { RemoveLiquidityForm } from 'hooks/pancakeswap/useRemoveLiquidityForm'

type RemoveLiquidityModalPage1TimerProps = {
  deadline: number
  setValue: UseFormSetValue<RemoveLiquidityForm>
}

export default function RemoveLiquidityModalPage1Timer({
  deadline,
  setValue,
}: RemoveLiquidityModalPage1TimerProps) {
  const enabled = !!deadline
  const { days, hours, minutes, seconds } = useCountdown(deadline, {
    enabled,
    leadingZero: false,
    onExpiration() {
      setValue(RemoveLiquidityField.Signature, undefined)
    },
  })

  const countdownText = joinCountdown(days, hours, minutes, seconds)

  return (
    <motion.p
      {...EXIT_MOTION}
      className="timer"
      variants={ANIMATION_MAP.fadeIn}
    >
      After <strong>{countdownText}</strong>, you need to sign again.
    </motion.p>
  )
}
