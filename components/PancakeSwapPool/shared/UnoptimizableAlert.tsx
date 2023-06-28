import { useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'

import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import { bnum } from 'utils/bnum'
import { useAuth, useStaking } from 'hooks'
import {
  AddLiquidityFormElement,
  FIELDS,
} from 'hooks/pancakeswap/useAddLiquidityForm'

import { StyledAddLiquidityFormUnoptimizableAlert } from './styled'
import Icon from 'components/Icon'

type AddLiquidityFormUnoptimizableAlertProps = {
  activeField: 'TokenA' | 'TokenB' | null
  assets: Hash[]
  focusedElement: AddLiquidityFormElement
  maxBalances: string[]
  optimizeDisabled: boolean
}

export default function AddLiquidityFormUnoptimizableAlert({
  activeField,
  assets,
  focusedElement,
  maxBalances,
  optimizeDisabled,
}: AddLiquidityFormUnoptimizableAlertProps) {
  const { isConnected } = useAuth()
  const { tokens } = useStaking()

  const message = useMemo(() => {
    if (maxBalances.every((b) => bnum(b).isZero())) return `Balance is empty.`

    const tokenIndex = maxBalances.findIndex((b) => bnum(b).isZero())
    if (tokenIndex >= 0) {
      const symbol = tokens[assets[tokenIndex]]?.symbol ?? ''
      return `Optimization is not possible because ${symbol} is 0.`
    }

    return `Insufficient pool balances`
  }, [assets, maxBalances, tokens])

  const showAlert =
    !!isConnected && focusedElement === 'Optimize' && optimizeDisabled

  return (
    <AnimatePresence>
      {showAlert && (
        <StyledAddLiquidityFormUnoptimizableAlert
          {...EXIT_MOTION}
          layout
          variants={ANIMATION_MAP.slideInDown}
        >
          <Icon icon="warning" />
          <p className="desc">{message}</p>
        </StyledAddLiquidityFormUnoptimizableAlert>
      )}
    </AnimatePresence>
  )
}
