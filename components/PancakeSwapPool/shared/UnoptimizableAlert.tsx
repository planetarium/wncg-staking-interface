import { memo, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'

import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import { bnum } from 'utils/bnum'
import { useAuth, useStaking } from 'hooks'
import type { AddLiquidityFormElement } from 'hooks/pancakeswap/useAddLiquidityForm'

import { StyledAddLiquidityFormUnoptimizableAlert } from './styled'
import Icon from 'components/Icon'

type AddLiquidityFormUnoptimizableProps = {
  assets: Hash[]
  focusedElement: AddLiquidityFormElement
  maxBalances: string[]
  optimizeDisabled: boolean
}

function AddLiquidityFormUnoptimizableAlert({
  assets,
  focusedElement,
  maxBalances,
  optimizeDisabled,
}: AddLiquidityFormUnoptimizableProps) {
  const { isConnected } = useAuth()
  const { tokens } = useStaking()

  const message = useMemo(() => {
    if (maxBalances.every((b) => bnum(b).isZero())) return `Balance is empty.`
    const tokenIndex = maxBalances.findIndex((b) => bnum(b).isZero())
    const symbol = tokens[assets[tokenIndex]]?.symbol ?? ''
    return `Optimization is not possible because ${symbol} is 0.`
  }, [assets, maxBalances, tokens])

  const showAlert =
    !!isConnected && focusedElement === 'Optimize' && optimizeDisabled

  return (
    <AnimatePresence>
      {showAlert && (
        <StyledAddLiquidityFormUnoptimizableAlert
          {...EXIT_MOTION}
          className="joinFormAlert"
          variants={ANIMATION_MAP.slideInDown}
          role="alert"
        >
          <Icon icon="warning" />
          <p className="desc">{message}</p>
        </StyledAddLiquidityFormUnoptimizableAlert>
      )}
    </AnimatePresence>
  )
}

export default memo(AddLiquidityFormUnoptimizableAlert)
