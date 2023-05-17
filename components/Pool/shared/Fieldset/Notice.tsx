import { useMemo } from 'react'
import { UseFormStateReturn } from 'react-hook-form'
import { AnimatePresence } from 'framer-motion'

import config from 'config'
import { LiquidityFieldType } from 'config/constants'
import { BASE_GAS_FEE } from 'config/misc'
import { EXIT_MOTION } from 'config/motions'
import { slideInDown } from 'config/motionVariants'
import { bnum } from 'utils/bnum'
import { useBalances, useJoinMath } from 'hooks'
import { JoinFormFocusedElement, JoinFormFields } from 'hooks/useJoinForm'

import { StyledJoinFormNotice } from './styled'
import Icon from 'components/Icon'
import Lottie from 'components/Lottie'

type JoinFormNoticeProps = {
  activeField: LiquidityFieldType | null
  currentField: LiquidityFieldType
  formState: UseFormStateReturn<JoinFormFields>
  focusedElement: JoinFormFocusedElement | null
  optimizeDisabled: boolean
  joinAmount: string
}

const motionVariants = {
  ...EXIT_MOTION,
  variants: slideInDown,
  transition: {
    duration: 0.2,
  },
}

function SubtractionNotice() {
  return (
    <StyledJoinFormNotice {...motionVariants}>
      <strong className="badge">
        <Lottie className="lottie" animationData="bell" />
        Notification
      </strong>

      <h5 className="title">
        {BASE_GAS_FEE} {config.nativeCurrency.symbol} is automatically
        subtracted for the gas fee.
      </h5>
      <p className="desc">
        You can change the amount manually and proceed to joining the pool.
      </p>
    </StyledJoinFormNotice>
  )
}

function ZeroAmountNotice() {
  return (
    <StyledJoinFormNotice {...motionVariants}>
      <strong className="badge">
        <Lottie className="lottie" animationData="bell" />
        Notification
      </strong>
      <h5 className="title">0 is entered.</h5>
      <p className="desc">
        It is because to keep at least {BASE_GAS_FEE}{' '}
        {config.nativeCurrency.symbol} to pay the gas fee. You can change the
        amount manually and proceed to joining the pool.
      </p>
    </StyledJoinFormNotice>
  )
}

function SuggestionNotice() {
  return (
    <StyledJoinFormNotice {...motionVariants} $suggestion>
      <strong className="badge">
        <Icon icon="star" />
        Recommendation
      </strong>

      <h5 className="title">
        To ensure a smooth transaction, we recommend leaving at least{' '}
        {BASE_GAS_FEE} {config.nativeCurrency.symbol}.
      </h5>
    </StyledJoinFormNotice>
  )
}

export default function JoinFormNotice({
  activeField,
  currentField,
  formState,
  focusedElement,
  joinAmount,
  optimizeDisabled,
}: JoinFormNoticeProps) {
  const {} = useJoinMath()
  const balanceOf = useBalances()
  const maxBalance = balanceOf(config.nativeCurrency.address)

  const maxSafeBalance = bnum(maxBalance).minus(BASE_GAS_FEE)

  const element = useMemo(() => {
    if (bnum(maxSafeBalance).gt(joinAmount)) return null

    switch (focusedElement) {
      case 'Input':
        if (bnum(joinAmount).isZero()) return null
        if (bnum(maxSafeBalance).eq(joinAmount)) return
        null

        return <SuggestionNotice />

      case 'MaxButton':
        if (activeField === currentField) {
          return bnum(joinAmount).gt(0) ? (
            <SubtractionNotice />
          ) : (
            <ZeroAmountNotice />
          )
        }

        return <SuggestionNotice />

      case 'OptimizeButton':
        if (bnum(joinAmount).isZero()) return <ZeroAmountNotice />

        return bnum(joinAmount).gt(maxSafeBalance) ? (
          <SuggestionNotice />
        ) : (
          <SubtractionNotice />
        )

      default:
        return null
    }
  }, [activeField, currentField, focusedElement, joinAmount, maxSafeBalance])

  const shouldValidate =
    Object.keys(formState.errors)?.length === 0 &&
    element != null &&
    ((optimizeDisabled && focusedElement !== 'OptimizeButton') ||
      !optimizeDisabled)

  return <AnimatePresence>{shouldValidate && element}</AnimatePresence>
}
