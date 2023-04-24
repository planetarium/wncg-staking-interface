import { memo } from 'react'
import type { UseFormSetValue, UseFormStateReturn } from 'react-hook-form'
import { AnimatePresence } from 'framer-motion'

import { LiquidityFieldType } from 'config/constants'
import { EXIT_MOTION } from 'config/motions'
import { slideInDown } from 'constants/motionVariants'
import { bnum } from 'utils/bnum'
import { useStaking, useJoinMath } from 'hooks'

import { JoinFormFields } from 'hooks/useJoinForm'

import { StyledJoinFormProportionalGuide } from './styled'
import NumberFormat from 'components/NumberFormat'

type JoinFormProportionalGuideProps = {
  joinAmounts: string[]
  assets: Hash[]
  maxBalances: string[]
  formState: UseFormStateReturn<JoinFormFields>
  setValue: UseFormSetValue<JoinFormFields>
}

function JoinFormProportionalGuide({
  joinAmounts,
  assets,
  maxBalances,
  formState,
  setValue,
}: JoinFormProportionalGuideProps) {
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
    bnum(propAmount).lte(maxBalances[1 - singleSidedFieldIndex])

  return (
    <AnimatePresence>
      {show && (
        <StyledJoinFormProportionalGuide
          {...EXIT_MOTION}
          className="joinFormProportionalGuide"
          variants={slideInDown}
        >
          <h4 className="title">
            Recomendation👍🏻 : Add{' '}
            <NumberFormat value={propAmount} symbol={subjectToken.symbol} />{' '}
            matching with{' '}
            <NumberFormat
              value={joinAmounts[singleSidedFieldIndex]}
              symbol={selectedToken.symbol}
            />{' '}
            for the minimal slippage.
          </h4>

          <button className="addButton" type="button" onClick={handleAdd}>
            Add <NumberFormat value={propAmount} /> {subjectToken.symbol}
          </button>
        </StyledJoinFormProportionalGuide>
      )}
    </AnimatePresence>
  )
}

export default memo(JoinFormProportionalGuide)
