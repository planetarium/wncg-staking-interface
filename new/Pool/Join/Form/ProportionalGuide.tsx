import { memo } from 'react'
import type { FieldErrorsImpl } from 'react-hook-form'
import { AnimatePresence } from 'framer-motion'

import { slideInDown } from 'constants/motionVariants'
import { counterTokenIndex } from 'utils/joinExit'
import { bnum } from 'utils/num'
import { getTokenSymbol } from 'utils/token'
import type { JoinFormFields } from './useJoinForm'
import { useJoinMath } from './useJoinMath'

import { StyledJoinFormProportionalGuide } from './styled'
import Button from 'new/Button'
import NumberFormat from 'new/NumberFormat'

type JoinFormProportionalGuideProps = {
  amounts: string[]
  assets: string[]
  balances: string[]
  fieldList: string[]
  errors: Partial<FieldErrorsImpl<JoinFormFields>>
  updateValue(fieldName: string, value: string): void
}

function JoinFormProportionalGuide({
  amounts,
  assets,
  balances,
  fieldList,
  errors,
  updateValue,
}: JoinFormProportionalGuideProps) {
  const { calcPropAmount } = useJoinMath()

  const singleSidedFieldIndex = amounts.findIndex((amount, i) => {
    return bnum(amount).gt(0) && bnum(amounts[counterTokenIndex(i)]).isZero()
  })
  const hasSingleSidedField = singleSidedFieldIndex > -1
  const propAmount = hasSingleSidedField
    ? calcPropAmount(amounts[singleSidedFieldIndex], singleSidedFieldIndex)
    : '0'
  const counterToken = assets[counterTokenIndex(singleSidedFieldIndex)]
  const counterTokenSymbol = getTokenSymbol(counterToken)

  function handleAdd() {
    updateValue(fieldList[counterTokenIndex(singleSidedFieldIndex)], propAmount)
  }

  const show =
    !errors[fieldList[singleSidedFieldIndex] as 'tokenAmount' | 'etherAmount']
      ?.message &&
    hasSingleSidedField &&
    bnum(propAmount).lte(balances[counterTokenIndex(singleSidedFieldIndex)])

  return (
    <AnimatePresence>
      {show && (
        <StyledJoinFormProportionalGuide
          className="joinFormProportionalGuide"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={slideInDown}
        >
          <h4 className="title">
            If you add {propAmount} {counterTokenSymbol} in proportion to , it
            will be the most reasonable join pool.
          </h4>

          <Button
            className="addButton"
            onClick={handleAdd}
            $variant="tiny"
            $contain
          >
            Add <NumberFormat value={propAmount} /> {counterTokenSymbol}
          </Button>
        </StyledJoinFormProportionalGuide>
      )}
    </AnimatePresence>
  )
}

export default memo(JoinFormProportionalGuide)
