import type { MouseEvent } from 'react'

import { useAtom, useSetAtom } from 'jotai'
import { AnimatePresence } from 'framer-motion'

import { hideJoinTooltipAtom, showPoolAtom } from 'states/ui'
import { EXIT_MOTION } from 'config/motions'
import { fadeIn } from 'config/motionVariants'
import { bnum } from 'utils/bnum'
import { useAuth, useStaking } from 'hooks'
import { useFetchUserBalances } from 'hooks/queries'

import { StyledStakeJoinButton } from './styled'
import Arrow from 'components/Arrow'
import JoinTooltip from './JoinTooltip'

export default function StakeJoinButton() {
  const { isConnected } = useAuth()
  const balanceMap = (useFetchUserBalances().data ??
    {}) as unknown as BalanceMap
  const { stakedTokenAddress } = useStaking()

  const hasLpTokenBalance = bnum(balanceMap[stakedTokenAddress]).gt(0)

  const [hideJoinTooltip, setHideJoinTooltip] = useAtom(hideJoinTooltipAtom)
  const setShowPool = useSetAtom(showPoolAtom)

  function openModal(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setShowPool(true)
  }

  function closeTooltip() {
    setHideJoinTooltip(true)
  }

  return (
    <StyledStakeJoinButton
      {...EXIT_MOTION}
      className="tooltipGroup"
      variants={fadeIn}
    >
      <button className="joinButton" type="button" onClick={openModal}>
        Join pool & Get LP tokens
        <Arrow $size={24} />
      </button>

      {isConnected && !hasLpTokenBalance && (
        <AnimatePresence>
          {!hideJoinTooltip && (
            <JoinTooltip closeTooltip={closeTooltip} $gap={8} />
          )}
        </AnimatePresence>
      )}
    </StyledStakeJoinButton>
  )
}
