import type { MouseEvent } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { AnimatePresence } from 'framer-motion'

import { slippageAtom } from 'states/system'
import { hideJoinTooltipAtom, showPoolAtom } from 'states/ui'
import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import { bnum } from 'utils/bnum'
import { useAuth, useBalances, useStaking, useResponsive } from 'hooks'

import { StyledStakeJoinButton } from './styled'
import Arrow from 'components/Arrow'
import Button from 'components/Button'
import JoinTooltip from './JoinTooltip'

export default function MainStakeJoinButton() {
  const { isConnected } = useAuth()
  const balanceOf = useBalances()
  const { isMobile } = useResponsive()
  const { lpToken } = useStaking()

  const hasLpTokenBalance = bnum(balanceOf(lpToken.address)).gt(0)

  const [hideJoinTooltip, setHideJoinTooltip] = useAtom(hideJoinTooltipAtom)
  const setShowPool = useSetAtom(showPoolAtom)
  const setSlippage = useSetAtom(slippageAtom)

  function openModal(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    setShowPool(true)
    setSlippage(null)
  }

  function closeTooltip() {
    setHideJoinTooltip(true)
  }

  return (
    <StyledStakeJoinButton
      {...EXIT_MOTION}
      className="tooltipGroup"
      variants={ANIMATION_MAP.fadeIn}
      $hasBalance={hasLpTokenBalance}
    >
      {(hasLpTokenBalance || !isConnected) && (
        <button className="joinButton" type="button" onClick={openModal}>
          Join pool & Get LP tokens
          <Arrow $size={24} />
        </button>
      )}

      {!hasLpTokenBalance && isConnected && (
        <Button
          type="button"
          onClick={openModal}
          $size={isMobile ? 'md' : 'lg'}
        >
          Join pool & Get LP tokens
        </Button>
      )}

      {isConnected && !hasLpTokenBalance && (
        <AnimatePresence>
          {!hideJoinTooltip && (
            <JoinTooltip closeTooltip={closeTooltip} $gap={20} />
          )}
        </AnimatePresence>
      )}
    </StyledStakeJoinButton>
  )
}
