import type { UseFormSetValue, UseFormStateReturn } from 'react-hook-form'
import { AnimatePresence } from 'framer-motion'

import { LiquidityFieldType } from 'config/constants'
import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import { bnum } from 'utils/bnum'
import { useStaking } from 'hooks'
import { useJoinMath } from 'hooks/balancer'
import type { JoinPoolForm } from 'hooks/balancer/useJoinForm'

import { StyledJoinFormProportionalGuideBanner } from './styled'
import Icon from 'components/Icon'
import NumberFormat from 'components/NumberFormat'

type JoinFormProportionalGuideBannerProps = {
  joinAmounts: string[]
  assets: Hash[]
  maxBalances: string[]
  formState: UseFormStateReturn<JoinPoolForm>
  setValue: UseFormSetValue<JoinPoolForm>
}

function JoinFormProportionalGuideBanner({
  joinAmounts,
  assets,
  maxBalances,
  formState,
  setValue,
}: JoinFormProportionalGuideBannerProps) {
  const { tokens } = useStaking()
  const { calcPropAmount } = useJoinMath()

  const singleSidedFieldIndex = joinAmounts.findIndex((amount, i) => {
    return bnum(amount).gt(0) && bnum(joinAmounts[1 - i]).isZero()
  })
  const hasSingleSidedField = singleSidedFieldIndex > -1

  const propAmount = hasSingleSidedField
    ? calcPropAmount(joinAmounts[singleSidedFieldIndex], singleSidedFieldIndex)
    : '0'

  const selectedTokenAddress = assets[singleSidedFieldIndex]
  const selectedToken = tokens[selectedTokenAddress] ?? {}
  const subjectTokenAddress = assets[1 - singleSidedFieldIndex]
  const subjectToken = tokens[subjectTokenAddress] ?? {}

  function handleAdd() {
    const fieldType =
      singleSidedFieldIndex === 0
        ? LiquidityFieldType.TokenB
        : LiquidityFieldType.TokenA

    setValue(fieldType, propAmount)
  }

  const show =
    Object.keys(formState?.errors).length === 0 &&
    hasSingleSidedField &&
    !bnum(propAmount).isZero() &&
    bnum(propAmount).lte(maxBalances[1 - singleSidedFieldIndex])

  return (
    <AnimatePresence>
      {show && (
        <StyledJoinFormProportionalGuideBanner
          {...EXIT_MOTION}
          className="joinFormProportionalGuide"
          variants={ANIMATION_MAP.slideInDown}
        >
          <h4 className="title">
            <Icon icon="star" />
            Recommendation
          </h4>

          <p className="desc">
            Add
            <NumberFormat
              value={propAmount}
              symbol={subjectToken.symbol}
            />{' '}
            matching with{' '}
            <NumberFormat
              value={joinAmounts[singleSidedFieldIndex]}
              symbol={selectedToken.symbol}
            />{' '}
            for the minimal slippage.
          </p>

          <button className="addButton" type="button" onClick={handleAdd}>
            Add <NumberFormat value={propAmount} /> {subjectToken.symbol}
          </button>
        </StyledJoinFormProportionalGuideBanner>
      )}
    </AnimatePresence>
  )
}

export default JoinFormProportionalGuideBanner
