import { memo, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'

import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import { bnum } from 'utils/bnum'
import { useAuth, useStaking } from 'hooks'
import type { JoinFormFocusedElement } from 'hooks/useJoinForm'

import { StyledJoinFormUnoptimizableAlert } from './styled'
import Icon from 'components/Icon'

type JoinFormUnoptimizableProps = {
  assets: Hash[]
  focusedElement: JoinFormFocusedElement
  maxBalances: string[]
  optimizeDisabled: boolean
}

function JoinFormUnoptimizableAlert({
  assets,
  focusedElement,
  maxBalances,
  optimizeDisabled,
}: JoinFormUnoptimizableProps) {
  const { isConnected } = useAuth()
  const { tokens } = useStaking()

  const message = useMemo(() => {
    if (maxBalances.every((b) => bnum(b).isZero())) return `Balance is empty.`
    const tokenIndex = maxBalances.findIndex((b) => bnum(b).isZero())
    const symbol = tokens[assets[tokenIndex]]?.symbol ?? ''
    return `Optimization is not possible because ${symbol} is 0.`
  }, [assets, maxBalances, tokens])

  const showAlert =
    !!isConnected && focusedElement === 'OptimizeButton' && optimizeDisabled

  return (
    <AnimatePresence>
      {showAlert && (
        <StyledJoinFormUnoptimizableAlert
          {...EXIT_MOTION}
          className="joinFormAlert"
          variants={ANIMATION_MAP.slideInDown}
          role="alert"
        >
          <Icon icon="warning" />
          <p className="desc">{message}</p>
        </StyledJoinFormUnoptimizableAlert>
      )}
    </AnimatePresence>
  )
}

export default memo(JoinFormUnoptimizableAlert)
