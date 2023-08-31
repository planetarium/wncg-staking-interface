import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'

import { StyledStakeJoinTooltip } from './styled'
import Tooltip from 'components/Tooltip'

type StakeJoinTooltipProps = {
  closeTooltip(): void
  $gap: number
}

export default function StakeJoinTooltip({
  closeTooltip,
  $gap,
}: StakeJoinTooltipProps) {
  return (
    <StyledStakeJoinTooltip {...EXIT_MOTION} variants={ANIMATION_MAP.fadeIn}>
      <Tooltip
        message="You need LP tokens to stake!"
        closeButton
        onAttemptToClose={closeTooltip}
        $align="center"
        $direction="bottom"
        $float
        $gap={$gap}
        $noWrap
      />
    </StyledStakeJoinTooltip>
  )
}
