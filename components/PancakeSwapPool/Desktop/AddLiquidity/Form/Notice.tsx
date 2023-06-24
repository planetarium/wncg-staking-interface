import { useMemo } from 'react'
import { UseFormStateReturn } from 'react-hook-form'
import { AnimatePresence } from 'framer-motion'

import { LiquidityFieldType } from 'config/constants'
import { BASE_GAS_FEE } from 'config/constants/liquidityPool'
import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import { bnum } from 'utils/bnum'
import { useBalances, useChain } from 'hooks'
import { useJoinMath } from './useJoinMath'
import {
  AddLiquidityFormElement,
  AddLiquidityForm,
} from 'hooks/pancakeswap/useAddLiquidityForm'

import { StyledAddLiquidityFormNoticeContent } from './styled'
import Icon from 'components/Icon'
import Lottie from 'components/Lottie'

type AddLiquidityFormNoticeProps = {
  activeField: LiquidityFieldType | null
  currentField: LiquidityFieldType
  formState: UseFormStateReturn<AddLiquidityForm>
  focusedElement: AddLiquidityFormElement
  amountIn: string
}

const motionVariants = {
  ...EXIT_MOTION,
  variants: ANIMATION_MAP.slideInDown,
  transition: {
    duration: 0.2,
  },
}

function SubtractionNotice() {
  const { nativeCurrency } = useChain()

  return (
    <StyledAddLiquidityFormNoticeContent {...motionVariants}>
      <strong className="badge">
        <Lottie className="lottie" animationData="bell" />
        Notification
      </strong>

      <h5 className="title">
        {BASE_GAS_FEE} {nativeCurrency.symbol} is automatically subtracted for
        the gas fee.
      </h5>
      <p className="desc">
        You can change the amount manually and proceed to joining the pool.
      </p>
    </StyledAddLiquidityFormNoticeContent>
  )
}

function ZeroAmountNotice() {
  const { nativeCurrency } = useChain()

  return (
    <StyledAddLiquidityFormNoticeContent {...motionVariants}>
      <strong className="badge">
        <Lottie className="lottie" animationData="bell" />
        Notification
      </strong>

      <h5 className="title">0 is entered.</h5>
      <p className="desc">
        It is because to keep at least {BASE_GAS_FEE} {nativeCurrency.symbol} to
        pay the gas fee. You can change the amount manually and proceed to
        joining the pool.
      </p>
    </StyledAddLiquidityFormNoticeContent>
  )
}

function SuggestionNotice() {
  const { nativeCurrency } = useChain()

  return (
    <StyledAddLiquidityFormNoticeContent {...motionVariants} $suggestion>
      <strong className="badge">
        <Icon icon="star" />
        Recommendation
      </strong>

      <h5 className="title">
        To ensure a smooth transaction, we recommend leaving at least{' '}
        {BASE_GAS_FEE} {nativeCurrency.symbol}.
      </h5>
    </StyledAddLiquidityFormNoticeContent>
  )
}

export default function AddLiquidityFormNotice({
  activeField,
  currentField,
  formState,
  focusedElement,
  amountIn,
}: AddLiquidityFormNoticeProps) {
  const balanceOf = useBalances()
  const { nativeCurrency } = useChain()
  const { optimizeUnavailable } = useJoinMath()
  const maxBalance = balanceOf(nativeCurrency.address)

  const maxSafeBalance = bnum(maxBalance).minus(BASE_GAS_FEE)

  const element = useMemo(() => {
    if (bnum(maxSafeBalance).gt(amountIn)) return null

    switch (focusedElement) {
      case 'Input':
        if (bnum(amountIn).isZero()) return null
        if (bnum(maxSafeBalance).eq(amountIn)) return
        null

        return <SuggestionNotice />

      case 'Max':
        if (activeField === currentField) {
          return bnum(amountIn).gt(0) ? (
            <SubtractionNotice />
          ) : (
            <ZeroAmountNotice />
          )
        }

        return <SuggestionNotice />

      case 'Optimize':
        if (bnum(amountIn).isZero()) return <ZeroAmountNotice />

        return bnum(amountIn).gt(maxSafeBalance) ? (
          <SuggestionNotice />
        ) : (
          <SubtractionNotice />
        )

      default:
        return null
    }
  }, [activeField, currentField, focusedElement, amountIn, maxSafeBalance])

  const shouldValidate =
    !optimizeUnavailable &&
    Object.keys(formState.errors)?.length === 0 &&
    element != null

  return <AnimatePresence>{shouldValidate && element}</AnimatePresence>
}
