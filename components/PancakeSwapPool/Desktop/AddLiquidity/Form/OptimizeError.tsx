import { useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'

import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import { useStaking } from 'hooks'
import { useJoinMath } from './useJoinMath'
import {
  AddLiquidityForm,
  AddLiquidityFormElement,
} from 'hooks/pancakeswap/useAddLiquidityForm'

import { StyledAddLiquidityFormAlert } from './styled'
import Icon from 'components/Icon'

type AddLiquidityFormOptimizeErrorProps = {
  activeField: 'TokenA' | 'TokenB' | null
  fields: AddLiquidityField[]
  focusedElement: AddLiquidityFormElement
  formState: UseFormStateReturn<AddLiquidityForm>
}

export default function AddLiquidityFormOptimizeError({
  activeField,
  fields,
  focusedElement,
  formState,
}: AddLiquidityFormOptimizeErrorProps) {
  const { optimizeUnavailable } = useJoinMath()
  const { poolTokenSymbols } = useStaking()

  const activeFieldIndex = fields.findIndex((i) => i === activeField)
  const subjectFieldIndex = 1 - activeFieldIndex

  const errorType = useMemo(() => {
    if (focusedElement === 'Optimize' && optimizeUnavailable != null) {
      return 'Unoptimizable'
    }

    const currentErrors = Object.keys(formState.errors)

    if (currentErrors.length === 1) {
      if (currentErrors[0] === activeField) return

      return `Insufficient_token`
    }

    return null
  }, [activeField, focusedElement, formState, optimizeUnavailable])

  const reason = useMemo(() => {
    if (errorType == null) return null
    if (optimizeUnavailable != null) {
      if (optimizeUnavailable === 'all') return `Balance is empty.`

      const symbol = poolTokenSymbols[optimizeUnavailable as number]

      if (symbol) return `Optimization is not possible because ${symbol} is 0.`
    }

    return `Need more ${poolTokenSymbols[subjectFieldIndex]} to match 5:5 ratio with ${poolTokenSymbols[activeFieldIndex]} amount you entered.`
  }, [
    activeFieldIndex,
    errorType,
    optimizeUnavailable,
    poolTokenSymbols,
    subjectFieldIndex,
  ])

  const showAlert = errorType != null

  return (
    <AnimatePresence>
      {showAlert && (
        <StyledAddLiquidityFormAlert
          {...EXIT_MOTION}
          layout
          variants={ANIMATION_MAP.slideInDown}
          $error
        >
          <span className="title">
            Error
            <Icon icon="warning" />
          </span>
          <p className="desc">{reason}</p>
        </StyledAddLiquidityFormAlert>
      )}
    </AnimatePresence>
  )
}
