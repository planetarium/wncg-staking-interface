import { memo, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'

import { EXIT_MOTION } from 'config/motions'
import { slideInDown } from 'config/motionVariants'
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
  const { tokenMap } = useStaking()

  const message = useMemo(() => {
    if (maxBalances.every((b) => bnum(b).isZero())) return `Balance is empty.`
    const tokenIndex = maxBalances.findIndex((b) => bnum(b).isZero())
    const { symbol = '' } = tokenMap[assets[tokenIndex]] ?? {}
    return `Optimization is not possible because ${symbol} is 0.`
  }, [assets, maxBalances, tokenMap])

  const showAlert =
    !!isConnected && focusedElement === 'OptimizeButton' && optimizeDisabled

  return (
    <AnimatePresence>
      {showAlert && (
        <StyledJoinFormUnoptimizableAlert
          {...EXIT_MOTION}
          className="joinFormAlert"
          variants={slideInDown}
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
