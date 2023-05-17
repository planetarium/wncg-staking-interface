import { memo } from 'react'
import type { UseFormSetValue, UseFormStateReturn } from 'react-hook-form'
import { AnimatePresence } from 'framer-motion'

import { LiquidityFieldType } from 'config/constants'
import { EXIT_MOTION } from 'config/motions'
import { slideInDown } from 'constants/motionVariants'
import { bnum } from 'utils/bnum'
import { useStaking, useJoinMath } from 'hooks'

import { JoinFormFields } from 'hooks/useJoinForm'

import { StyledJoinFormProportionalGuideBanner } from './styled'
import NumberFormat from 'components/NumberFormat'
import Icon from 'components/Icon'

type JoinFormProportionalGuideBannerProps = {
  joinAmounts: string[]
  assets: Hash[]
  maxBalances: string[]
  formState: UseFormStateReturn<JoinFormFields>
  setValue: UseFormSetValue<JoinFormFields>
}

function JoinFormProportionalGuideBanner({
  joinAmounts,
  assets,
  maxBalances,
  formState,
  setValue,
}: JoinFormProportionalGuideBannerProps) {
  const { tokenMap } = useStaking()
  const { calcPropAmount } = useJoinMath()

  const singleSidedFieldIndex = joinAmounts.findIndex((amount, i) => {
    return bnum(amount).gt(0) && bnum(joinAmounts[1 - i]).isZero()
  })
  const hasSingleSidedField = singleSidedFieldIndex > -1

  const propAmount = hasSingleSidedField
    ? calcPropAmount(joinAmounts[singleSidedFieldIndex], singleSidedFieldIndex)
    : '0'

  const selectedTokenAddress = assets[singleSidedFieldIndex]
  const selectedToken = tokenMap[selectedTokenAddress]
  const subjectTokenAddress = assets[1 - singleSidedFieldIndex]
  const subjectToken = tokenMap[subjectTokenAddress]

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
          variants={slideInDown}
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

export default memo(JoinFormProportionalGuideBanner)
