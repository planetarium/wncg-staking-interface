import { memo, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'

import { EXIT_MOTION } from 'config/motions'
import { slideInDown } from 'config/motionVariants'
import { bnum } from 'utils/bnum'
import { useStaking } from 'hooks'

import { StyledJoinFormUnoptimizable } from './styled'
import Icon from 'components/Icon'

type JoinFormUnoptimizableProps = {
  assets: Hash[]
  maxBalances: string[]
  showAlert: boolean
}

function JoinFormUnoptimizable({
  assets,
  maxBalances,
  showAlert,
}: JoinFormUnoptimizableProps) {
  const { tokenMap } = useStaking()

  const message = useMemo(() => {
    if (maxBalances.every((b) => bnum(b).isZero()))
      return `Your balance is empty.`
    const tokenIndex = maxBalances.findIndex((b) => bnum(b).isZero())
    const { symbol } = tokenMap[assets[tokenIndex]]
    return `Optimization is not possible because ${symbol} is 0.`
  }, [assets, maxBalances, tokenMap])

  return (
    <AnimatePresence>
      {showAlert && (
        <StyledJoinFormUnoptimizable
          {...EXIT_MOTION}
          className="joinFormAlert"
          variants={slideInDown}
          role="alert"
        >
          <Icon icon="warning" $size={24} />
          <h4 className="title">{message}</h4>
        </StyledJoinFormUnoptimizable>
      )}
    </AnimatePresence>
  )
}

export default memo(JoinFormUnoptimizable)
